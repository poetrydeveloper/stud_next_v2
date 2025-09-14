// app/cash/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CashDay } from '@/app/lib/types/cash';
import CashEventList from '@/app/components/CashEventList';
import Link from 'next/link';
import { formatDate, formatPrice } from '@/app/lib/productUnitHelpers';

export default function CashDayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [cashDay, setCashDay] = useState<CashDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const loadCashDay = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cash-days/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки кассового дня');
      }
      
      const data = await response.json();
      setCashDay(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCashDay = async () => {
    if (!cashDay) return;

    try {
      setClosing(true);
      const response = await fetch(`/api/cash-days/${cashDay.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isClosed: true }),
      });

      if (!response.ok) {
        throw new Error('Ошибка закрытия кассового дня');
      }

      router.push('/cash');
      router.refresh();
    } catch (err) {
      console.error('Error:', err);
      alert('Не удалось закрыть кассовый день');
    } finally {
      setClosing(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadCashDay();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (error || !cashDay) {
    return (
      <div className="p-6">
        <div className="text-red-500 mb-4">{error || 'Кассовый день не найден'}</div>
        <button
          onClick={() => router.push('/cash')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Назад к журналу
        </button>
      </div>
    );
  }

  const date = new Date(cashDay.date);
  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/cash')}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
        >
          ← Назад
        </button>
        <h1 className="text-2xl font-bold">Кассовый день: {formatDate(date)}</h1>
      </div>

      {/* Статус и сумма */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Статус</p>
            <p className="text-lg font-semibold">
              {cashDay.isClosed ? (
                <span className="text-red-600">Закрыт</span>
              ) : (
                <span className="text-green-600">Открыт</span>
              )}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Общая сумма</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(cashDay.total)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Количество событий</p>
            <p className="text-lg font-semibold">{cashDay.events.length}</p>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex gap-4 mb-6">
        {!cashDay.isClosed && (
          <>
            <Link
              href={`/cash/${cashDay.id}/add-event`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Добавить событие
            </Link>
            
            {isToday && (
              <button
                onClick={handleCloseCashDay}
                disabled={closing}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                {closing ? 'Закрытие...' : 'Закрыть день'}
              </button>
            )}
          </>
        )}
      </div>

      {/* Список событий */}
      <div>
        <h2 className="text-xl font-semibold mb-4">События кассового дня</h2>
        {cashDay.events.length > 0 ? (
          <CashEventList events={cashDay.events} />
        ) : (
          <div className="text-center text-gray-500 py-8 border border-dashed border-gray-300 rounded-lg">
            Нет событий за этот день
          </div>
        )}
      </div>
    </div>
  );
}