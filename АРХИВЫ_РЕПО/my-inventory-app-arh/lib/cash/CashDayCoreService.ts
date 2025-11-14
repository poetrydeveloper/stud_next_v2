// app/lib/cash/CashDayCoreService.ts
import prisma from '@/app/lib/prisma';

export class CashDayCoreService {
  /**
   * Получить начало дня в локальном времени (решает проблему часовых поясов)
   */
  static getLocalDayStart(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * Получить диапазон дат для дня (для поиска)
   */
  static getDayRange(date: Date = new Date()): { start: Date; end: Date } {
    const start = this.getLocalDayStart(date);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    return { start, end };
  }

  /**
   * Открыть новый торговый день
   */
  static async openCashDay(date: Date = new Date()): Promise<any> {
    const { start } = this.getDayRange(date);

    const existingOpenDay = await prisma.cashDay.findFirst({
      where: { 
        date: { gte: start, lt: new Date(start.getTime() + 24 * 60 * 60 * 1000) },
        isClosed: false
      }
    });

    if (existingOpenDay) {
      throw new Error('Торговый день уже открыт');
    }

    return await prisma.cashDay.create({
      data: { date: start, isClosed: false, total: 0 }
    });
  }

  /**
   * Закрыть торговый день
   */
  static async closeCashDay(cashDayId: number): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      const cashDay = await tx.cashDay.findUnique({
        where: { id: cashDayId },
        include: { events: true }
      });

      if (!cashDay) throw new Error('CashDay не найден');
      if (cashDay.isClosed) throw new Error('Торговый день уже закрыт');

      const total = cashDay.events.reduce((sum, event) => sum + event.amount, 0);

      return await tx.cashDay.update({
        where: { id: cashDayId },
        data: { isClosed: true, total }
      });
    });
  }

  /**
   * Получить текущий открытый день
   */
  static async getCurrentCashDay(): Promise<any | null> {
    const { start, end } = this.getDayRange();

    return await prisma.cashDay.findFirst({
      where: {
        date: { gte: start, lt: end },
        isClosed: false
      },
      include: {
        events: {
          include: {
            productUnit: {
              include: { product: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  /**
   * Получить кассовый день по ID
   */
  static async getCashDayById(id: number): Promise<any> {
    const cashDay = await prisma.cashDay.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            productUnit: {
              include: {
                product: {
                  include: {
                    images: { where: { isMain: true }, take: 1 }
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!cashDay) throw new Error('CashDay не найден');
    return cashDay;
  }

  /**
   * Получить историю дней
   */
  static async getCashDayHistory(days: number = 30): Promise<any[]> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    return await prisma.cashDay.findMany({
      where: { date: { gte: sinceDate } },
      include: {
        events: {
          include: {
            productUnit: {
              select: {
                id: true,
                productName: true,
                serialNumber: true,
                product: { select: { name: true } }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { date: 'desc' }
    });
  }
}