// app/components/CashDayCard.tsx
'use client';

import { CashDay } from '@/app/lib/types/cash';
import Link from 'next/link';
import { formatDate, formatPrice } from '@/app/lib/productUnitHelpers';

interface CashDayCardProps {
  cashDay: CashDay;
}

export default function CashDayCard({ cashDay }: CashDayCardProps) {
  const date = new Date(cashDay.date);
  const isToday = new Date().toDateString() === date.toDateString();
  const isClosed = cashDay.isClosed;

  return (
    <div className={`border rounded-lg p-4 ${
      isToday && !isClosed 
        ? 'bg-green-50 border-green-200' 
        : isClosed 
          ? 'bg-gray-50 border-gray-200' 
          : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">
            {formatDate(date)}
            {isToday && !isClosed && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Сегодня
              </span>
            )}
            {isClosed && (
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                Закрыт
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600">
            Событий: {cashDay.events.length}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">
            {formatPrice(cashDay.total)}
          </p>
          <p className="text-sm text-gray-600">Общая сумма</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link
          href={`/cash/${cashDay.id}`}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          Подробнее →
        </Link>
        
        {isToday && !isClosed && (
          <Link
            href={`/cash/${cashDay.id}/add-event`}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Добавить событие
          </Link>
        )}
      </div>
    </div>
  );
}