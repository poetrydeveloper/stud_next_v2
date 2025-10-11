import { ProductUnitPhysicalStatus, UnitDisassemblyStatus } from "@prisma/client";
import prisma from "./prisma";

export class DisassemblyValidationService {
  
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

  // Проверка доступности сценариев для unit
  static async getUnitScenarios(unitId: number) {
    const unit = await prisma.productUnit.findUnique({
      where: { id: unitId },
      include: { product: true }
    });

    if (!unit) {
      return [];
    }

    // Разрешенные статусы для разборки
    const allowedDisassemblyStatuses = [
      UnitDisassemblyStatus.MONOLITH,
      UnitDisassemblyStatus.RESTORED
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

  // Получение сценария по ID
  static async getScenario(id: number) {
    return prisma.disassemblyScenario.findUnique({
      where: { id }
    });
  }
}