// app/lib/cash/CashValidationService.ts
import { CashDayCoreService } from './CashDayCoreService';

export class CashValidationService {
  /**
   * Проверить что торговый день открыт
   */
  static async validateCashDayOpen(): Promise<void> {
    const currentDay = await CashDayCoreService.getCurrentCashDay();
    if (!currentDay) {
      throw new Error('Торговый день не открыт. Откройте день перед операциями.');
    }
  }

  /**
   * Удалить кассовый день (только для админов)
   */
  static async deleteCashDay(cashDayId: number): Promise<void> {
    const cashDay = await CashDayCoreService.getCashDayById(cashDayId);
    
    if (!cashDay.isClosed) {
      throw new Error('Нельзя удалить открытый кассовый день');
    }

    // Удаление реализовано в CoreService для транзакционности
  }
}