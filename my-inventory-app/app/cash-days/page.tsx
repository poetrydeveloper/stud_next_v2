// app/cash-days/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { CashDay } from '@/app/lib/types/cash';
import CashDayCard from '@/app/components/CashDayCard';

export default function CashDaysPage() {
  const [cashDays, setCashDays] = useState<CashDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const loadCashDays = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Загрузка кассовых дней...');
      
      const response = await fetch('/api/cash-days');
      
      console.log('📊 Статус ответа:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Ошибка сервера:', errorText);
        throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Получены данные:', data);
      setCashDays(data);
    } catch (err) {
      console.error('❌ Ошибка:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const createTodayCashDay = async () => {
    try {
      setCreating(true);
      setError(null);
      console.log('🔄 Создание кассового дня...');
      
      const response = await fetch('/api/cash-days', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0]
        })
      });

      console.log('📊 Статус создания:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Ошибка создания:', errorData);
        throw new Error(errorData.error || 'Ошибка создания кассового дня');
      }

      const newDay = await response.json();
      console.log('✅ Создан день:', newDay);
      await loadCashDays();
    } catch (err) {
      console.error('❌ Ошибка:', err);
      setError(err instanceof Error ? err.message : 'Ошибка создания дня');
    } finally {
      setCreating(false);
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
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Загрузка кассовых дней...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-red-800 font-semibold mb-2">Ошибка</h3>
          <p className="text-red-600">{error}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={loadCashDays}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Попробовать снова
          </button>
          {!todayCashDay && (
            <button
              onClick={createTodayCashDay}
              disabled={creating}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {creating ? 'Создание...' : 'Создать день'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Кассовый журнал</h1>
        <div className="flex gap-4">
          {!todayCashDay && (
            <button
              onClick={createTodayCashDay}
              disabled={creating}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {creating ? 'Создание...' : 'Открыть кассовый день'}
            </button>
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
        <div className="text-center text-gray-500 py-8 border border-dashed border-gray-300 rounded-lg">
          <div className="text-2xl mb-2">📋</div>
          <p className="text-lg font-medium mb-2">Нет кассовых дней</p>
          <p className="text-sm mb-4">Создайте первый кассовый день чтобы начать работу</p>
          <button
            onClick={createTodayCashDay}
            disabled={creating}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {creating ? 'Создание...' : 'Создать первый день'}
          </button>
        </div>
      )}

      {/* Отладочная информация */}
      {process.env.NODE_ENV === 'development' && cashDays.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Отладочная информация:</h3>
          <p className="text-xs text-gray-600">
            Всего дней: {cashDays.length} | 
            Сегодняшний: {todayCashDay ? 'да' : 'нет'} | 
            Закрытых: {cashDays.filter(d => d.isClosed).length}
          </p>
        </div>
      )}
    </div>
  );
}
