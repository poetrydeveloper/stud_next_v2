// app/lib/prismaLogMiddleware.ts
import { PrismaClient } from '@prisma/client';

export function createLogMiddleware(prisma: PrismaClient) {
  prisma.$use(async (params, next) => {
    // Логируем только изменения ProductUnit
    if (params.model === 'ProductUnit' && (params.action === 'update' || params.action === 'create')) {
      const result = await next(params);
      
      // Для update - логируем изменения
      if (params.action === 'update') {
        await logProductUnitChanges(params.args.where.id, params.args.data, result);
      }
      // Для create - логируем создание
      else if (params.action === 'create') {
        await logProductUnitCreation(result.id, result);
      }
      
      return result;
    }
    
    return next(params);
  });
}

async function logProductUnitChanges(unitId: number, newData: any, updatedUnit: any) {
  const changes: string[] = [];
  
  // Отслеживаем изменения статусов
  if (newData.statusCard !== undefined) {
    changes.push(`Статус карточки изменен на: ${newData.statusCard}`);
  }
  if (newData.statusProduct !== undefined) {
    changes.push(`Физический статус изменен на: ${newData.statusProduct}`);
  }
  if (newData.quantityInCandidate !== undefined) {
    changes.push(`Количество в кандидатах: ${newData.quantityInCandidate}`);
  }
  if (newData.quantityInRequest !== undefined) {
    changes.push(`Количество в заявке: ${newData.quantityInRequest}`);
  }
  
  if (changes.length > 0) {
    const prisma = new PrismaClient();
    await prisma.productUnitLog.create({
      data: {
        productUnitId: unitId,
        type: 'STATUS_CHANGE',
        message: changes.join(' | '),
        meta: {
          changes,
          newData,
          timestamp: new Date().toISOString()
        }
      }
    });
    await prisma.$disconnect();
  }
}

async function logProductUnitCreation(unitId: number, unitData: any) {
  const prisma = new PrismaClient();
  await prisma.productUnitLog.create({
    data: {
      productUnitId: unitId,
      type: 'SYSTEM',
      message: `ProductUnit создан: ${unitData.serialNumber}`,
      meta: {
        event: 'UNIT_CREATED',
        serialNumber: unitData.serialNumber,
        initialStatus: unitData.statusCard,
        timestamp: new Date().toISOString()
      }
    }
  });
  await prisma.$disconnect();
}