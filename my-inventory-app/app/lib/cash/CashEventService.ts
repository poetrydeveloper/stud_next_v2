// app/lib/cash/CashEventService.ts
import prisma from '@/app/lib/prisma';
import { CashEventType } from '@prisma/client';
import { CashDayCoreService } from './CashDayCoreService';

export class CashEventService {
  /**
   * Добавить событие в кассовый день
   */
  static async addCashEvent(cashDayId: number, eventData: {
    type: CashEventType;
    amount: number;
    notes: string;
    productUnitId?: number;
  }): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      const cashDay = await tx.cashDay.findUnique({ where: { id: cashDayId } });
      if (!cashDay) throw new Error('Кассовый день не найден');
      if (cashDay.isClosed) throw new Error('Нельзя добавлять события в закрытый день');

      const cashEvent = await tx.cashEvent.create({
        data: { ...eventData, cashDayId }
      });

      await tx.cashDay.update({
        where: { id: cashDayId },
        data: { total: { increment: eventData.amount } }
      });

      return cashEvent;
    });
  }

  /**
   * Создать событие продажи
   */
  static async createSaleEvent(productUnitId: number, salePrice: number, productName?: string): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      const { start, end } = CashDayCoreService.getDayRange();

      let cashDay = await tx.cashDay.findFirst({
        where: { date: { gte: start, lt: end }, isClosed: false }
      });

      if (!cashDay) {
        cashDay = await tx.cashDay.create({
          data: { date: start, isClosed: false, total: 0 }
        });
      }

      const cashEvent = await tx.cashEvent.create({
        data: {
          type: 'SALE',
          amount: salePrice,
          notes: `Продажа: ${productName || 'товар'}`,
          cashDayId: cashDay.id,
          productUnitId
        }
      });

      await tx.cashDay.update({
        where: { id: cashDay.id },
        data: { total: { increment: salePrice } }
      });

      return cashEvent;
    });
  }

  /**
   * Получить события кассового дня
   */
  static async getCashDayEvents(cashDayId: number): Promise<any[]> {
    return await prisma.cashEvent.findMany({
      where: { cashDayId },
      include: {
        productUnit: {
          select: { id: true, productName: true, serialNumber: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}