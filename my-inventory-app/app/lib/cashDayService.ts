// app/lib/cashDayService.ts
import prisma from '@/app/lib/prisma';

export class CashDayService {
  /**
   * Открыть новый торговый день
   */
  static async openCashDay(date: Date = new Date()): Promise<any> {
    // Округляем дату до начала дня
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    // Проверяем нет ли уже открытого дня
    const existingOpenDay = await prisma.cashDay.findFirst({
      where: { 
        date: dayStart,
        isClosed: false
      }
    });

    if (existingOpenDay) {
      throw new Error('Торговый день уже открыт');
    }

    // Создаем новый день
    const cashDay = await prisma.cashDay.create({
      data: {
        date: dayStart,
        isClosed: false,
        total: 0
      }
    });

    return cashDay;
  }

  /**
   * Закрыть торговый день с подсчетом итогов
   */
  static async closeCashDay(cashDayId: number): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      const cashDay = await tx.cashDay.findUnique({
        where: { id: cashDayId },
        include: { events: true }
      });

      if (!cashDay) {
        throw new Error('CashDay не найден');
      }

      if (cashDay.isClosed) {
        throw new Error('Торговый день уже закрыт');
      }

      // Считаем итоговую сумму по событиям
      const total = cashDay.events.reduce((sum, event) => sum + event.amount, 0);

      // Закрываем день
      const updatedCashDay = await tx.cashDay.update({
        where: { id: cashDayId },
        data: {
          isClosed: true,
          total: total
        }
      });

      return updatedCashDay;
    });
  }

  /**
   * Получить текущий открытый торговый день
   */
  static async getCurrentCashDay(): Promise<any | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cashDay = await prisma.cashDay.findFirst({
      where: {
        date: today,
        isClosed: false
      },
      include: {
        events: {
          include: {
            productUnit: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return cashDay;
  }

  /**
   * Проверить что торговый день открыт
   */
  static async validateCashDayOpen(): Promise<void> {
    const currentDay = await this.getCurrentCashDay();
    if (!currentDay) {
      throw new Error('Торговый день не открыт. Откройте день перед операциями.');
    }
  }

  /**
   * Получить историю торговых дней
   */
  static async getCashDayHistory(days: number = 30): Promise<any[]> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const cashDays = await prisma.cashDay.findMany({
      where: {
        date: { gte: sinceDate }
      },
      include: {
        events: true
      },
      orderBy: { date: 'desc' }
    });

    return cashDays;
  }
}