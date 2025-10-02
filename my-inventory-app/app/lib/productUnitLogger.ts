// app/lib/productUnitLogger.ts
import prisma from '@/app/lib/prisma';

export class ProductUnitLogger {
  static async logEvent(unitId: number, type: string, message: string, meta?: any) {
    return await prisma.productUnitLog.create({
      data: {
        productUnitId: unitId,
        type,
        message,
        meta: meta || {}
      }
    });
  }

  static async getUnitLogs(unitId: number, limit: number = 50) {
    return await prisma.productUnitLog.findMany({
      where: { productUnitId: unitId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  static async logStatusChange(unitId: number, oldStatus: string, newStatus: string, reason?: string) {
    return this.logEvent(
      unitId, 
      'STATUS_CHANGE', 
      `Статус изменен: ${oldStatus} → ${newStatus}${reason ? ` (${reason})` : ''}`,
      {
        oldStatus,
        newStatus,
        reason,
        timestamp: new Date().toISOString()
      }
    );
  }
}