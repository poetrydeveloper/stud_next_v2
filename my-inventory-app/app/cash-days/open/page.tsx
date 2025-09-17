// app/cash/open/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OpenCashDayPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleOpenCashDay = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/cash-days', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка открытия кассового дня');
      }

      router.push('/cash');
      router.refresh();
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Открытие кассового дня</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          Вы собираетесь открыть кассовый день на сегодняшнюю дату:
        </p>
        <p className="font-semibold text-blue-900 mt-2">
          {new Date().toLocaleDateString('ru-RU')}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleOpenCashDay}
          disabled={loading}
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Открытие...' : 'Открыть кассовый день'}
        </button>
        
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}