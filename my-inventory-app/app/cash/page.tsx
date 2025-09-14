// app/cash/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { CashDay } from '@/app/lib/types/cash';
import CashDayCard from '@/app/components/CashDayCard';
import Link from 'next/link';

export default function CashJournalPage() {
  const [cashDays, setCashDays] = useState<CashDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCashDays = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cash-days');
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки кассовых дней');
      }
      
      const data = await response.json();
      setCashDays(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCashDays();
  }, []);

  const getTodayCashDay = () => {
    const today = new Date().toISOString().split('T')[0];
    return cashDays.find(day => day.date.startsWith(today) && !day.isClosed);
  };

  const todayCashDay = getTodayCashDay();

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadCashDays}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Кассовый журнал</h1>
        <div className="flex gap-4">
          {!todayCashDay && (
            <Link
              href="/cash/open"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Открыть кассовый день
            </Link>
          )}
          <button
            onClick={loadCashDays}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Обновить
          </button>
        </div>
      </div>

      {/* Текущий день */}
      {todayCashDay && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Текущий день</h2>
          <CashDayCard cashDay={todayCashDay} />
        </div>
      )}

      {/* Предыдущие дни */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Предыдущие дни</h2>
        <div className="grid gap-4">
          {cashDays
            .filter(day => !day.date.startsWith(new Date().toISOString().split('T')[0]) || day.isClosed)
            .map((cashDay) => (
              <CashDayCard key={cashDay.id} cashDay={cashDay} />
            ))}
        </div>
      </div>

      {cashDays.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Нет кассовых дней. Откройте первый кассовый день.
        </div>
      )}
    </div>
  );
}