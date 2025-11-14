import { ProductUnitPhysicalStatus, UnitDisassemblyStatus } from "@prisma/client";
import prisma from "./prisma";

interface CreateScenarioData {
  name: string;
  parentProductCode: string;
  childProductCodes: string[];
}

interface ExecuteDisassemblyData {
  unitId: number;
  scenarioId: number;
}

interface ExecuteAssemblyData {
  parentUnitId: number;
  childUnitIds: number[];
  scenarioId?: number;
}

export class DisassemblyService {
  
  // Создание сценария разборки
  static async createScenario(data: CreateScenarioData) {
    const parentProduct = await prisma.product.findUnique({
      where: { code: data.parentProductCode }
    });

    if (!parentProduct) {
      throw new Error(`Родительский продукт с кодом "${data.parentProductCode}" не найден`);
    }

    const childProducts = await prisma.product.findMany({
      where: { code: { in: data.childProductCodes } }
    });

    if (childProducts.length !== data.childProductCodes.length) {
      const foundCodes = childProducts.map(p => p.code);
      const missingCodes = data.childProductCodes.filter(code => !foundCodes.includes(code));
      throw new Error(`Дочерние продукты не найдены: ${missingCodes.join(', ')}`);
    }

    const existingScenario = await prisma.disassemblyScenario.findFirst({
      where: { 
        parentProductCode: data.parentProductCode,
        name: data.name 
      }
    });

    if (existingScenario) {
      throw new Error('Сценарий с таким названием для этого продукта уже существует');
    }

    return prisma.disassemblyScenario.create({
      data: {
        name: data.name,
        parentProductCode: data.parentProductCode,
        childProductCodes: data.childProductCodes,
        partsCount: data.childProductCodes.length,
        isActive: true
      }
    });
  }

  // Выполнение разборки
  static async executeDisassembly(data: ExecuteDisassemblyData) {
    return prisma.$transaction(async (tx) => {
      console.log('🔍 DisassemblyService.executeDisassembly:', data);

      const scenario = await tx.disassemblyScenario.findUnique({
        where: { id: data.scenarioId }
      });

      if (!scenario) {
        throw new Error('Сценарий не найден');
      }

      if (!scenario.isActive) {
        throw new Error('Сценарий не активен');
      }

      const parentUnit = await tx.productUnit.findUnique({
        where: { id: data.unitId },
        include: { product: true }
      });

      if (!parentUnit) {
        throw new Error('Unit не найден');
      }

      const unitProductCode = parentUnit.productCode || parentUnit.product?.code;
      if (unitProductCode !== scenario.parentProductCode) {
        throw new Error(`Сценарий не подходит для этого unit. Ожидается продукт: ${scenario.parentProductCode}, получен: ${unitProductCode}`);
      }

      // ИСПРАВЛЕНИЕ: Добавляем RESTORED в разрешенные статусы для разборки
      const allowedDisassemblyStatuses = [
        UnitDisassemblyStatus.MONOLITH,
        UnitDisassemblyStatus.RESTORED
      ];

      if (parentUnit.statusProduct !== ProductUnitPhysicalStatus.IN_STORE ||
          !allowedDisassemblyStatuses.includes(parentUnit.disassemblyStatus)) {
        throw new Error('Unit должен быть IN_STORE и MONOLITH или RESTORED для разборки');
      }

      const childProducts = await tx.product.findMany({
        where: { code: { in: scenario.childProductCodes as string[] } }
      });

      if (childProducts.length !== scenario.partsCount) {
        throw new Error('Не все дочерние продукты найдены в базе');
      }

      // Создаем дочерние units
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
            statusCard: 'ARRIVED',
            statusProduct: ProductUnitPhysicalStatus.IN_STORE,
            disassemblyStatus: UnitDisassemblyStatus.PARTIAL,
            disassembledParentId: parentUnit.id,
            isParsingAlgorithm: false,
            supplierId: parentUnit.supplierId,
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
          isParsingAlgorithm: false,
          disassemblyScenarioId: scenario.id
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
              parentProductCode: scenario.parentProductCode,
              childProductCodes: scenario.childProductCodes,
              timestamp: new Date()
            }
          }
        });
      }

      console.log('✅ DisassemblyService.executeDisassembly успешно:', {
        parentUnitId: updatedParent.id,
        childUnitsCount: childUnits.length,
        scenarioId: scenario.id
      });

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
      console.log('🔍 DisassemblyService.executeAssembly:', data);

      const parentUnit = await tx.productUnit.findUnique({
        where: { id: data.parentUnitId }
      });

      if (!parentUnit) {
        throw new Error('Родительский Unit не найден');
      }

      if (parentUnit.statusProduct !== ProductUnitPhysicalStatus.IN_DISASSEMBLED) {
        throw new Error('Родительский Unit не в статусе IN_DISASSEMBLED');
      }

      // Ищем дочерние units с улучшенной проверкой
      const childUnits = await tx.productUnit.findMany({
        where: { 
          id: { in: data.childUnitIds },
          statusProduct: ProductUnitPhysicalStatus.IN_STORE,
          disassemblyStatus: {
            in: [UnitDisassemblyStatus.PARTIAL, UnitDisassemblyStatus.MONOLITH]
          }
        }
      });

      console.log('🔍 Available child units for assembly:', {
        requestedIds: data.childUnitIds,
        foundIds: childUnits.map(u => u.id),
        foundCount: childUnits.length,
        requestedCount: data.childUnitIds.length
      });

      // Детальная проверка доступности
      if (childUnits.length !== data.childUnitIds.length) {
        const foundIds = childUnits.map(u => u.id);
        const missingIds = data.childUnitIds.filter(id => !foundIds.includes(id));
        
        // Получаем информацию о недоступных units для отладки
        const unavailableUnits = await tx.productUnit.findMany({
          where: { id: { in: missingIds } },
          select: {
            id: true,
            statusProduct: true,
            disassemblyStatus: true,
            serialNumber: true
          }
        });

        console.error('❌ Unavailable units for assembly:', unavailableUnits);
        
        throw new Error(
          `Не все дочерние Unit доступны для сборки. ` +
          `Недоступны: ${missingIds.join(', ')}. ` +
          `Причина: ${unavailableUnits.map(u => 
            `ID ${u.id} (${u.serialNumber}): status=${u.statusProduct}, disassembly=${u.disassemblyStatus}`
          ).join('; ')}`
        );
      }

      // Обновляем статусы детей
      await tx.productUnit.updateMany({
        where: { id: { in: data.childUnitIds } },
        data: {
          statusProduct: ProductUnitPhysicalStatus.IN_COLLECTED,
          disassemblyStatus: UnitDisassemblyStatus.COLLECTED,
          disassembledParentId: null
        }
      });

      // Восстанавливаем родителя
      const restoredParent = await tx.productUnit.update({
        where: { id: data.parentUnitId },
        data: {
          statusProduct: ProductUnitPhysicalStatus.IN_STORE,
          disassemblyStatus: UnitDisassemblyStatus.RESTORED,
          disassemblyScenarioId: data.scenarioId || null
        }
      });

      // Логируем операцию
      for (const unit of [restoredParent, ...childUnits]) {
        await tx.productUnitLog.create({
          data: {
            productUnitId: unit.id,
            type: 'ASSEMBLY_OPERATION',
            message: `Выполнена сборка. Родитель: ${parentUnit.id}, Дети: ${data.childUnitIds.join(', ')}`,
            meta: {
              operation: 'assembly', 
              parentUnitId: parentUnit.id,
              childUnitIds: data.childUnitIds,
              scenarioId: data.scenarioId,
              timestamp: new Date()
            }
          }
        });
      }

      console.log('✅ DisassemblyService.executeAssembly успешно:', {
        parentUnitId: restoredParent.id,
        childUnitsCount: childUnits.length,
        newParentStatus: restoredParent.statusProduct,
        newParentDisassemblyStatus: restoredParent.disassemblyStatus
      });

      return {
        parentUnit: restoredParent,
        childUnits
      };
    });
  }

  // Валидация сценария
  static async validateScenario(scenarioId: number) {
    const scenario = await prisma.disassemblyScenario.findUnique({
      where: { id: scenarioId }
    });

    if (!scenario) {
      throw new Error('Сценарий не найден');
    }

    const products = await prisma.product.findMany({
      where: { code: { in: scenario.childProductCodes as string[] } }
    });

    const isValid = products.length === scenario.partsCount;
    const missingProducts = scenario.partsCount - products.length;

    return {
      isValid,
      scenario,
      productsFound: products.length,
      productsRequired: scenario.partsCount,
      missingProducts,
      canExecute: isValid
    };
  }

  // Получение сценария по ID
  static async getScenario(id: number) {
    return prisma.disassemblyScenario.findUnique({
      where: { id }
    });
  }

  // Получение доступных сценариев для unit - ИСПРАВЛЕННЫЙ МЕТОД
  static async getUnitScenarios(unitId: number) {
    const unit = await prisma.productUnit.findUnique({
      where: { id: unitId },
      include: { product: true }
    });

    if (!unit) {
      return [];
    }

    // ИСПРАВЛЕНИЕ: Проверяем разрешенные статусы для разборки
    const allowedDisassemblyStatuses = [
      UnitDisassemblyStatus.MONOLITH,
      UnitDisassemblyStatus.RESTORED  // ДОБАВЛЕНО RESTORED
    ];

    if (!allowedDisassemblyStatuses.includes(unit.disassemblyStatus) || 
        unit.statusProduct !== ProductUnitPhysicalStatus.IN_STORE) {
      return [];
    }

    const unitProductCode = unit.productCode || unit.product?.code;
    
    return prisma.disassemblyScenario.findMany({
      where: { 
        parentProductCode: unitProductCode,
        isActive: true 
      }
    });
  }

  // Получение всех сценариев
  static async getAllScenarios(includeInactive: boolean = false) {
    return prisma.disassemblyScenario.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Поиск сценариев по коду продукта
  static async getScenariosByProductCode(productCode: string) {
    return prisma.disassemblyScenario.findMany({
      where: { 
        parentProductCode: productCode,
        isActive: true 
      }
    });
  }
}