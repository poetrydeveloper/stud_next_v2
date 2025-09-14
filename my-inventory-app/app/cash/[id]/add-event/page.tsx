// app/cash/[id]/add-event/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CashEventType } from '@/app/lib/types/cash';

export default function AddCashEventPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: 'SALE' as CashEventType,
    amount: '',
    notes: '',
    productUnitId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/cash-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          amount: parseFloat(formData.amount) || 0,
          notes: formData.notes || undefined,
          cashDayId: parseInt(params.id as string),
          productUnitId: formData.productUnitId ? parseInt(formData.productUnitId) : undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка создания события');
      }

      router.push(`/cash/${params.id}`);
      router.refresh();
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push(`/cash/${params.id}`)}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
        >
          ← Назад
        </button>
        <h1 className="text-2xl font-bold">Добавить событие</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Тип события */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тип события
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
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

        {/* Сумма */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Сумма (руб.)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        {/* ID единицы товара (для продаж) */}
        {formData.type === 'SALE' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID единицы товара (опционально)
            </label>
            <input
              type="number"
              name="productUnitId"
              value={formData.productUnitId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123"
            />
          </div>
        )}

        {/* Заметки */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Заметки (опционально)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Дополнительная информация..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
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
            onClick={() => router.push(`/cash/${params.id}`)}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
