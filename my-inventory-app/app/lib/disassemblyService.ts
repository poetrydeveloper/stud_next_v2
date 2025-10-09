// app/lib/disassemblyService.ts
import { ProductUnitPhysicalStatus, UnitDisassemblyStatus } from "@prisma/client";
import prisma from "./prisma";

interface CreateScenarioData {
  name: string;
  parentUnitId: number;
  childProductsIds: number[];
}

interface ExecuteDisassemblyData {
  scenarioId: number;
}

interface ExecuteAssemblyData {
  parentUnitId: number;
  childUnitIds: number[];
}

export class DisassemblyService {
  
  // Создание сценария разборки
  static async createScenario(data: CreateScenarioData) {
    const parentUnit = await prisma.productUnit.findUnique({
      where: { id: data.parentUnitId },
      include: { product: true }
    });

    if (!parentUnit) {
      throw new Error('Родительский Unit не найден');
    }

    if (parentUnit.statusProduct !== ProductUnitPhysicalStatus.IN_STORE) {
      throw new Error('Unit должен быть IN_STORE для создания сценария');
    }

    // Проверяем существующие сценарии
    const existingScenario = await prisma.disassemblyScenario.findUnique({
      where: { parentUnitId: data.parentUnitId }
    });

    if (existingScenario) {
      throw new Error('Сценарий для этого Unit уже существует');
    }

    return prisma.disassemblyScenario.create({
      data: {
        name: data.name,
        parentUnitId: data.parentUnitId,
        partsCount: data.childProductsIds.length,
        childProductsIds: data.childProductsIds,
        isActive: true
      }
    });
  }

  // Выполнение разборки
  static async executeDisassembly(data: ExecuteDisassemblyData) {
    return prisma.$transaction(async (tx) => {
      const scenario = await tx.disassemblyScenario.findUnique({
        where: { id: data.scenarioId },
        include: { parentUnit: true }
      });

      if (!scenario) {
        throw new Error('Сценарий не найден');
      }

      if (!scenario.isActive) {
        throw new Error('Сценарий не активен');
      }

      const parentUnit = scenario.parentUnit;

      if (parentUnit.statusProduct !== ProductUnitPhysicalStatus.IN_STORE ||
          parentUnit.disassemblyStatus !== UnitDisassemblyStatus.MONOLITH) {
        throw new Error('Некорректный статус родительского Unit');
      }

      const childProducts = await tx.product.findMany({
        where: { id: { in: scenario.childProductsIds as number[] } }
      });

      if (childProducts.length !== scenario.partsCount) {
        throw new Error('Не все продукты найдены');
      }

      // Создаем дочерние Unit
      const childUnits = [];
      for (const product of childProducts) {
        const childUnit = await tx.productUnit.create({
          data: {
            serialNumber: `${parentUnit.serialNumber}_PART_${Date.now()}_${product.id}`,
            productId: product.id,
            spineId: parentUnit.spineId,
            productCode: product.code,
            productName: product.name,
            productDescription: product.description,
            productCategoryId: product.categoryId,
            statusCard: 'CLEAR',
            statusProduct: ProductUnitPhysicalStatus.IN_STORE,
            disassemblyStatus: UnitDisassemblyStatus.PARTIAL,
            disassembledParentId: parentUnit.id,
            isParsingAlgorithm: false,
            supplierId: null,
            customerId: null
          }
        });
        childUnits.push(childUnit);
      }

      // Обновляем родительский Unit
      const updatedParent = await tx.productUnit.update({
        where: { id: parentUnit.id },
        data: {
          statusProduct: ProductUnitPhysicalStatus.IN_DISASSEMBLED,
          disassemblyStatus: UnitDisassemblyStatus.DISASSEMBLED,
          isParsingAlgorithm: false
        }
      });

      // Обновляем сценарий с ID созданных детей
      await tx.disassemblyScenario.update({
        where: { id: scenario.id },
        data: {
          partialChildUnits: childUnits.map(unit => unit.id)
        }
      });

      // Логируем операцию
      for (const unit of [updatedParent, ...childUnits]) {
        await tx.productUnitLog.create({
          data: {
            productUnitId: unit.id,
            type: 'DISASSEMBLY_OPERATION',
            message: `Выполнена разборка. Родитель: ${parentUnit.id}, Сценарий: ${scenario.id}`,
            meta: {
              operation: 'disassembly',
              parentUnitId: parentUnit.id,
              scenarioId: scenario.id,
              timestamp: new Date()
            }
          }
        });
      }

      return {
        parentUnit: updatedParent,
        childUnits,
        scenario
      };
    });
  }

  // Выполнение сборки
  static async executeAssembly(data: ExecuteAssemblyData) {
    return prisma.$transaction(async (tx) => {
      const parentUnit = await tx.productUnit.findUnique({
        where: { id: data.parentUnitId }
      });

      if (!parentUnit || parentUnit.statusProduct !== ProductUnitPhysicalStatus.IN_DISASSEMBLED) {
        throw new Error('Родительский Unit не найден или не в статусе IN_DISASSEMBLED');
      }

      const childUnits = await tx.productUnit.findMany({
        where: { 
          id: { in: data.childUnitIds },
          statusProduct: ProductUnitPhysicalStatus.IN_STORE,
          disassemblyStatus: UnitDisassemblyStatus.PARTIAL
        }
      });

      if (childUnits.length !== data.childUnitIds.length) {
        throw new Error('Не все дочерние Unit доступны для сборки');
      }

      // Обновляем статусы детей
      await tx.productUnit.updateMany({
        where: { id: { in: data.childUnitIds } },
        data: {
          statusProduct: ProductUnitPhysicalStatus.IN_COLLECTED,
          disassemblyStatus: UnitDisassemblyStatus.COLLECTED
        }
      });

      // Восстанавливаем родителя
      const restoredParent = await tx.productUnit.update({
        where: { id: data.parentUnitId },
        data: {
          statusProduct: ProductUnitPhysicalStatus.IN_STORE,
          disassemblyStatus: UnitDisassemblyStatus.RESTORED
        }
      });

      // Логируем операцию
      for (const unit of [restoredParent, ...childUnits]) {
        await tx.productUnitLog.create({
          data: {
            productUnitId: unit.id,
            type: 'ASSEMBLY_OPERATION',
            message: `Выполнена сборка. Родитель: ${parentUnit.id}`,
            meta: {
              operation: 'assembly', 
              parentUnitId: parentUnit.id,
              childUnitIds: data.childUnitIds,
              timestamp: new Date()
            }
          }
        });
      }

      return {
        parentUnit: restoredParent,
        childUnits
      };
    });
  }

  // Валидация сценария
  static async validateScenario(scenarioId: number) {
    const scenario = await prisma.disassemblyScenario.findUnique({
      where: { id: scenarioId },
      include: { parentUnit: true }
    });

    if (!scenario) {
      throw new Error('Сценарий не найден');
    }

    const products = await prisma.product.findMany({
      where: { id: { in: scenario.childProductsIds as number[] } }
    });

    const isValid = products.length === scenario.partsCount;
    const missingProducts = scenario.partsCount - products.length;

    return {
      isValid,
      scenario,
      productsFound: products.length,
      productsRequired: scenario.partsCount,
      missingProducts,
      canExecute: isValid && scenario.parentUnit.statusProduct === ProductUnitPhysicalStatus.IN_STORE
    };
  }

  // Получение сценария по ID
  static async getScenario(id: number) {
    return prisma.disassemblyScenario.findUnique({
      where: { id },
      include: {
        parentUnit: {
          include: {
            product: true,
            spine: true
          }
        }
      }
    });
  }

  // Получение сценариев по unitId
  static async getUnitScenarios(unitId: number) {
    return prisma.disassemblyScenario.findMany({
      where: { parentUnitId: unitId },
      include: {
        parentUnit: {
          include: {
            product: true
          }
        }
      }
    });
  }
}