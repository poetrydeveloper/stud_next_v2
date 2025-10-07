// app/lib/cashDayService.ts
import prisma from '@/app/lib/prisma';
import { CashEventType } from '@prisma/client';

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
        events: {
          include: {
            productUnit: {
              select: {
                id: true,
                productName: true,
                serialNumber: true,
                product: {
                  select: {
                    name: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { date: 'desc' }
    });

    return cashDays;
  }

  /**
   * Получить кассовый день по ID с событиями
   */
  static async getCashDayById(id: number): Promise<any> {
    const cashDay = await prisma.cashDay.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            productUnit: {
              select: {
                id: true,
                productName: true,
                serialNumber: true,
                product: {
                  select: {
                    name: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!cashDay) {
      throw new Error('CashDay не найден');
    }

    return cashDay;
  }

  /**
   * Получить события кассового дня
   */
  static async getCashDayEvents(cashDayId: number): Promise<any[]> {
    const events = await prisma.cashEvent.findMany({
      where: { cashDayId },
      include: {
        productUnit: {
          select: {
            id: true,
            productName: true,
            serialNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return events;
  }

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
      // Проверяем что день открыт
      const cashDay = await tx.cashDay.findUnique({
        where: { id: cashDayId }
      });

      if (!cashDay) {
        throw new Error('Кассовый день не найден');
      }

      if (cashDay.isClosed) {
        throw new Error('Нельзя добавлять события в закрытый день');
      }

      // Создаем событие
      const cashEvent = await tx.cashEvent.create({
        data: {
          ...eventData,
          cashDayId
        }
      });

      // Обновляем общую сумму дня
      await tx.cashDay.update({
        where: { id: cashDayId },
        data: {
          total: {
            increment: eventData.amount
          }
        }
      });

      return cashEvent;
    });
  }

  /**
   * Создать событие продажи с автоматической привязкой к текущему дню
   */
  static async createSaleEvent(productUnitId: number, salePrice: number, productName?: string): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      // Получаем текущий кассовый день
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let cashDay = await tx.cashDay.findFirst({
        where: {
          date: today,
          isClosed: false
        }
      });

      // Если дня нет - создаем
      if (!cashDay) {
        cashDay = await tx.cashDay.create({
          data: {
            date: today,
            isClosed: false,
            total: 0
          }
        });
      }

      // Создаем событие продажи
      const cashEvent = await tx.cashEvent.create({
        data: {
          type: 'SALE',
          amount: salePrice,
          notes: `Продажа: ${productName || 'товар'}`,
          cashDayId: cashDay.id,
          productUnitId: productUnitId
        }
      });

      // Обновляем общую сумму дня
      await tx.cashDay.update({
        where: { id: cashDay.id },
        data: {
          total: {
            increment: salePrice
          }
        }
      });

      return cashEvent;
    });
  }

  /**
   * Получить статистику по кассовым дням
   */
  static async getCashDaysStats(days: number = 30): Promise<{
    totalSales: number;
    averagePerDay: number;
    bestDay: { date: string; amount: number; };
    openDays: number;
    closedDays: number;
  }> {
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

    const closedDays = cashDays.filter(day => day.isClosed);
    const totalSales = closedDays.reduce((sum, day) => sum + day.total, 0);
    const averagePerDay = closedDays.length > 0 ? totalSales / closedDays.length : 0;
    
    const bestDay = closedDays.length > 0 
      ? closedDays.reduce((best, day) => day.total > best.amount ? { date: day.date, amount: day.total } : best, { date: closedDays[0].date, amount: closedDays[0].total })
      : { date: new Date().toISOString(), amount: 0 };

    return {
      totalSales,
      averagePerDay,
      bestDay: {
        date: bestDay.date.toISOString(),
        amount: bestDay.amount
      },
      openDays: cashDays.filter(day => !day.isClosed).length,
      closedDays: closedDays.length
    };
  }

  /**
   * Удалить кассовый день (только для админов)
   */
  static async deleteCashDay(cashDayId: number): Promise<void> {
    const cashDay = await prisma.cashDay.findUnique({
      where: { id: cashDayId },
      include: { events: true }
    });

    if (!cashDay) {
      throw new Error('CashDay не найден');
    }

    if (!cashDay.isClosed) {
      throw new Error('Нельзя удалить открытый кассовый день');
    }

    // Удаляем все события и затем день
    await prisma.$transaction([
      prisma.cashEvent.deleteMany({
        where: { cashDayId }
      }),
      prisma.cashDay.delete({
        where: { id: cashDayId }
      })
    ]);
  }

  /**
   * Получить детальный отчет по кассовому дню
   */
  static async getCashDayReport(cashDayId: number): Promise<{
    cashDay: any;
    salesByType: { type: string; count: number; total: number; }[];
    productStats: { productName: string; count: number; total: number; }[];
    hourlyStats: { hour: number; count: number; total: number; }[];
  }> {
    const cashDay = await this.getCashDayById(cashDayId);
    
    // Статистика по типам событий
    const salesByType = cashDay.events.reduce((acc: any[], event) => {
      const existing = acc.find(item => item.type === event.type);
      if (existing) {
        existing.count++;
        existing.total += event.amount;
      } else {
        acc.push({ type: event.type, count: 1, total: event.amount });
      }
      return acc;
    }, []);

    // Статистика по товарам
    const productStats = cashDay.events
      .filter(event => event.productUnit)
      .reduce((acc: any[], event) => {
        const productName = event.productUnit.productName || 'Неизвестный товар';
        const existing = acc.find(item => item.productName === productName);
        if (existing) {
          existing.count++;
          existing.total += event.amount;
        } else {
          acc.push({ productName, count: 1, total: event.amount });
        }
        return acc;
      }, []);

    // Статистика по часам
    const hourlyStats = cashDay.events.reduce((acc: any[], event) => {
      const hour = new Date(event.createdAt).getHours();
      const existing = acc.find(item => item.hour === hour);
      if (existing) {
        existing.count++;
        existing.total += event.amount;
      } else {
        acc.push({ hour, count: 1, total: event.amount });
      }
      return acc;
    }, []);

    // Сортируем по часам
    hourlyStats.sort((a, b) => a.hour - b.hour);

    return {
      cashDay,
      salesByType,
      productStats,
      hourlyStats
    };
  }
}