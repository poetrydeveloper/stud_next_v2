// app/lib/cash/CashDayAutoCloseService.ts
import prisma from "@/app/lib/prisma";

export class CashDayAutoCloseService {
  /**
   * Найти и закрыть все незакрытые кассовые дни (вчера и ранее)
   */
  static async closeAllPastCashDays() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999); // Конец вчерашнего дня

    // Находим все незакрытые дни до вчерашнего дня включительно
    const openCashDays = await prisma.cashDay.findMany({
      where: {
        isClosed: false,
        date: {
          lte: yesterday
        }
      },
      include: {
        events: {
          include: {
            productUnit: {
              select: {
                id: true,
                serialNumber: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    const results = [];

    for (const cashDay of openCashDays) {
      try {
        // Рассчитываем итоговую сумму
        const total = cashDay.events.reduce((sum, event) => {
          if (event.type === 'SALE') {
            return sum + event.amount;
          } else if (event.type === 'RETURN') {
            return sum - event.amount;
          }
          return sum;
        }, 0);

        // Обновляем время закрытия на 23:59 дня открытия
        const closeTime = new Date(cashDay.date);
        closeTime.setHours(23, 59, 59, 999);

        // Закрываем день
        const updatedCashDay = await prisma.cashDay.update({
          where: { id: cashDay.id },
          data: {
            isClosed: true,
            total: total,
            updatedAt: closeTime
          }
        });

        results.push({
          id: cashDay.id,
          date: cashDay.date,
          total: total,
          eventsCount: cashDay.events.length,
          status: 'success' as const
        });

        console.log(`Закрыт кассовый день за ${cashDay.date.toISOString().split('T')[0]}`);

      } catch (error) {
        results.push({
          id: cashDay.id,
          date: cashDay.date,
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'error' as const
        });

        console.error(`Ошибка закрытия дня ${cashDay.id}:`, error);
      }
    }

    return results;
  }

  /**
   * Получить статистику по незакрытым дням
   */
  static async getOpenCashDaysStats() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    const openCashDays = await prisma.cashDay.findMany({
      where: {
        isClosed: false,
        date: {
          lte: yesterday
        }
      },
      include: {
        _count: {
          select: {
            events: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return {
      count: openCashDays.length,
      days: openCashDays.map(day => ({
        id: day.id,
        date: day.date,
        eventsCount: day._count.events
      }))
    };
  }
}