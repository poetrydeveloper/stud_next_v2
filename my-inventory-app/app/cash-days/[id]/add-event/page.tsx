// app/cash-days/[id]/add-event/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CashEventType } from '@/app/lib/types/cash';
import ProductSearch from '@/app/components/ProductSearch';
import { ProductUnit } from '@/app/lib/types/productUnit';

export default function AddCashEventPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProductUnit, setSelectedProductUnit] = useState<ProductUnit>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/cash-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.get('type') as CashEventType,
          amount: parseFloat(formData.get('amount') as string),
          notes: formData.get('notes') as string,
          cashDayId: parseInt(params.id as string),
          productUnitId: selectedProductUnit?.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка создания события');
      }

      router.push(`/cash-days/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push(`/cash-days/${params.id}`)}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
        >
          ← Назад
        </button>
        <h1 className="text-2xl font-bold">Добавить событие</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тип события
          </label>
          <select
            name="type"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="SALE">Продажа</option>
            <option value="RETURN">Возврат</option>
            <option value="PRICE_QUERY">Запрос цены</option>
            <option value="ORDER">Заказ</option>
            <option value="OTHER">Прочее</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Сумма (руб.)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="amount"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        <ProductSearch
          onSelect={setSelectedProductUnit}
          selectedProductUnit={selectedProductUnit}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Заметки (опционально)
          </label>
          <textarea
            name="notes"
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Дополнительная информация..."
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Создание...' : 'Создать событие'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/cash-days/${params.id}`)}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}