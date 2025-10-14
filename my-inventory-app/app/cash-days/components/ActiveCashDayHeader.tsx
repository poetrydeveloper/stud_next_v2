// app/cash-days/components/ActiveCashDayHeader.tsx
import Link from "next/link";
import ExportExcelButton from "./ExportExcelButton";
import { CashDay } from './types';
import { formatCurrency } from './helpers/cashDayHelpers';

interface ActiveCashDayHeaderProps {
  cashDay: CashDay;
  calculatedTotal: number;
  isClosing: boolean;
  onClose: () => void;
  onReload: () => void;
}

export default function ActiveCashDayHeader({ 
  cashDay, 
  calculatedTotal, 
  isClosing, 
  onClose, 
  onReload 
}: ActiveCashDayHeaderProps) {
  return (
    <div className="bg-white rounded-lg border border-green-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            🟢 Активный кассовый день
          </h2>
          <p className="text-gray-600">
            {new Date(cashDay.date).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(calculatedTotal)}
          </div>
          <div className="text-sm text-gray-600">
            {cashDay.events.length} операций
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          href="/store"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🏪 Перейти в магазин
        </Link>
        <button
          onClick={onClose}
          disabled={isClosing}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isClosing ? "Закрываем..." : "❌ Закрыть день"}
        </button>
        <button
          onClick={onReload}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          🔄 Обновить
        </button>
        
        {cashDay.events.length > 0 && (
          <ExportExcelButton cashDayId={cashDay.id} />
        )}
      </div>
    </div>
  );
}