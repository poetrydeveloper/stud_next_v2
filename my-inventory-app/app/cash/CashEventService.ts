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
   * Создать событие возврата с автоматической привязкой к текущему дню
   */
  static async createReturnEvent(
    productUnitId: number, 
    returnAmount: number, 
    productName?: string, 
    reason?: string
  ): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      const { start, end } = CashDayCoreService.getDayRange();

      let cashDay = await tx.cashDay.findFirst({
        where: {
          date: { gte: start, lt: end },
          isClosed: false
        }
      });

      // Если дня нет - создаем
      if (!cashDay) {
        cashDay = await tx.cashDay.create({
          data: {
            date: start,
            isClosed: false,
            total: 0
          }
        });
      }

      // Создаем событие возврата (отрицательная сумма)
      const cashEvent = await tx.cashEvent.create({
        data: {
          type: 'RETURN',
          amount: -returnAmount, // Отрицательная сумма для возврата
          notes: `Возврат: ${productName || 'товар'}${reason ? ` (${reason})` : ''}`,
          cashDayId: cashDay.id,
          productUnitId: productUnitId
        }
      });

      // Обновляем общую сумму дня (уменьшаем)
      await tx.cashDay.update({
        where: { id: cashDay.id },
        data: {
          total: {
            decrement: returnAmount
          }
        }
      });

      return cashEvent;
    });
  }

  /**
   * Создать событие запроса цены
   */
  static async createPriceQueryEvent(notes: string, productUnitId?: number): Promise<any> {
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
          type: 'PRICE_QUERY',
          amount: 0,
          notes: notes,
          cashDayId: cashDay.id,
          productUnitId
        }
      });

      return cashEvent;
    });
  }

  /**
   * Создать событие заказа
   */
  static async createOrderEvent(amount: number, notes: string, productUnitId?: number): Promise<any> {
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
          type: 'ORDER',
          amount: amount,
          notes: notes,
          cashDayId: cashDay.id,
          productUnitId
        }
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
          select: { 
            id: true, 
            productName: true, 
            serialNumber: true,
            productCode: true,
            statusProduct: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Получить статистику по событиям за период
   */
  static async getEventsStats(startDate: Date, endDate: Date): Promise<{
    totalSales: number;
    totalReturns: number;
    salesCount: number;
    returnsCount: number;
    netAmount: number;
  }> {
    const events = await prisma.cashEvent.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        type: true,
        amount: true
      }
    });

    const sales = events.filter(e => e.type === 'SALE');
    const returns = events.filter(e => e.type === 'RETURN');

    const totalSales = sales.reduce((sum, event) => sum + event.amount, 0);
    const totalReturns = Math.abs(returns.reduce((sum, event) => sum + event.amount, 0));
    const netAmount = totalSales - totalReturns;

    return {
      totalSales,
      totalReturns,
      salesCount: sales.length,
      returnsCount: returns.length,
      netAmount
    };
  }
}