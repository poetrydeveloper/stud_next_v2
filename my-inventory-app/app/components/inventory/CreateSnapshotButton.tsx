// app/components/inventory/CreateSnapshotButton.tsx
"use client";
import { useState } from 'react';

export default function CreateSnapshotButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createSnapshot = async () => {
    if (!confirm('Создать снимок текущих остатков? Это зафиксирует состояние на текущий момент.')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/inventory/snapshots/daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
      
      if (data.ok) {
        // Можно добавить уведомление об успехе
        console.log('Снимок создан успешно');
      }
    } catch (error) {
      setResult({ ok: false, error: 'Ошибка сети' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">📸 Снимки остатков</h3>
          <p className="text-gray-600 text-sm">
            Фиксация текущего состояния склада для аналитики
          </p>
        </div>
        <button
          onClick={createSnapshot}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Создание...
            </>
          ) : (
            '📸 Создать снимок'
          )}
        </button>
      </div>

      {result && (
        <div className={`mt-4 p-3 rounded ${
          result.ok ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {result.ok ? (
            <div>
              <strong>✅ Успешно!</strong> {result.message}
              {result.data && (
                <div className="text-sm mt-2">
                  Продуктов со stock: {result.data.summary.productsWithStock}<br />
                  Всего единиц: {result.data.summary.totalUnits}<br />
                  Общая стоимость: {result.data.summary.totalValue.toLocaleString()} ₽
                </div>
              )}
            </div>
          ) : (
            <div>
              <strong>❌ Ошибка:</strong> {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}