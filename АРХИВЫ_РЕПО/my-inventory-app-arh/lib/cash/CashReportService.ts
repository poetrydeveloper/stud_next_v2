// app/lib/cash/CashReportService.ts
import { CashDayCoreService } from './CashDayCoreService';

export class CashReportService {
  /**
   * Получить статистику по кассовым дням
   */
  static async getCashDaysStats(days: number = 30): Promise<{
    totalSales: number;
    averagePerDay: number;
    bestDay: { date: string; amount: number };
    openDays: number;
    closedDays: number;
  }> {
    const cashDays = await CashDayCoreService.getCashDayHistory(days);
    
    const closedDays = cashDays.filter(day => day.isClosed);
    const totalSales = closedDays.reduce((sum, day) => sum + day.total, 0);
    const averagePerDay = closedDays.length > 0 ? totalSales / closedDays.length : 0;
    
    const bestDay = closedDays.length > 0 
      ? closedDays.reduce((best, day) => 
          day.total > best.amount ? { date: day.date, amount: day.total } : best, 
          { date: closedDays[0].date, amount: closedDays[0].total }
        )
      : { date: new Date().toISOString(), amount: 0 };

    return {
      totalSales,
      averagePerDay,
      bestDay: { date: bestDay.date.toISOString(), amount: bestDay.amount },
      openDays: cashDays.filter(day => !day.isClosed).length,
      closedDays: closedDays.length
    };
  }

  /**
   * Получить детальный отчет по кассовому дню
   */
  static async getCashDayReport(cashDayId: number): Promise<{
    cashDay: any;
    salesByType: { type: string; count: number; total: number }[];
    productStats: { productName: string; count: number; total: number }[];
    hourlyStats: { hour: number; count: number; total: number }[];
  }> {
    const cashDay = await CashDayCoreService.getCashDayById(cashDayId);
    
    const salesByType = this.calculateSalesByType(cashDay.events);
    const productStats = this.calculateProductStats(cashDay.events);
    const hourlyStats = this.calculateHourlyStats(cashDay.events);

    return { cashDay, salesByType, productStats, hourlyStats };
  }

  private static calculateSalesByType(events: any[]) {
    return events.reduce((acc: any[], event) => {
      const existing = acc.find(item => item.type === event.type);
      existing ? (existing.count++, existing.total += event.amount) 
               : acc.push({ type: event.type, count: 1, total: event.amount });
      return acc;
    }, []);
  }

  private static calculateProductStats(events: any[]) {
    return events
      .filter(event => event.productUnit)
      .reduce((acc: any[], event) => {
        const productName = event.productUnit.productName || 'Неизвестный товар';
        const existing = acc.find(item => item.productName === productName);
        existing ? (existing.count++, existing.total += event.amount)
                 : acc.push({ productName, count: 1, total: event.amount });
        return acc;
      }, []);
  }

  private static calculateHourlyStats(events: any[]) {
    const stats = events.reduce((acc: any[], event) => {
      const hour = new Date(event.createdAt).getHours();
      const existing = acc.find(item => item.hour === hour);
      existing ? (existing.count++, existing.total += event.amount)
               : acc.push({ hour, count: 1, total: event.amount });
      return acc;
    }, []);
    
    return stats.sort((a, b) => a.hour - b.hour);
  }
}