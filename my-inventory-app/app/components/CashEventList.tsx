// app/components/CashEventList.tsx
'use client';

import { CashEvent } from '@/app/lib/types/cash';
import { formatDateTime, formatPrice } from '@/app/lib/productUnitHelpers';

interface CashEventListProps {
  events: CashEvent[];
}

export default function CashEventList({ events }: CashEventListProps) {
  const getEventTypeText = (type: string) => {
    const types = {
      SALE: 'Продажа',
      RETURN: 'Возврат',
      PRICE_QUERY: 'Запрос цены',
      ORDER: 'Заказ',
      OTHER: 'Прочее'
    };
    return types[type as keyof typeof types] || type;
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      SALE: 'bg-green-100 text-green-800 border-green-200',
      RETURN: 'bg-red-100 text-red-800 border-red-200',
      PRICE_QUERY: 'bg-blue-100 text-blue-800 border-blue-200',
      ORDER: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      OTHER: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className={`px-2 py-1 rounded text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                {getEventTypeText(event.type)}
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {formatDateTime(new Date(event.createdAt))}
              </p>
            </div>
            
            <div className="text-right">
              <p className={`text-lg font-semibold ${
                event.type === 'RETURN' ? 'text-red-600' : 'text-green-600'
              }`}>
                {event.type === 'RETURN' ? '-' : '+'}{formatPrice(event.amount)}
              </p>
            </div>
          </div>

          {/* Информация о товаре */}
          {event.productUnit && (
            <div className="border-t border-gray-100 pt-2 mt-2">
              <p className="text-sm font-medium">{event.productUnit.product.name}</p>
              <p className="text-xs text-gray-600">
                Серийный номер: {event.productUnit.serialNumber}
              </p>
            </div>
          )}

          {/* Заметки */}
          {event.notes && (
            <div className="border-t border-gray-100 pt-2 mt-2">
              <p className="text-sm text-gray-600">{event.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}