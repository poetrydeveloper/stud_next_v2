// app/components/ClosePastCashDaysButton.tsx
'use client';

import { useState } from 'react';

export function ClosePastCashDaysButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleClosePastDays = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/cash-days/close-past', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, error: 'Ошибка сети' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    const response = await fetch('/api/cash-days/close-past');
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Закрытие кассовых дней</h3>
      
      <div className="space-y-2">
        <button
          onClick={handleClosePastDays}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Закрытие...' : 'Закрыть все прошлые дни'}
        </button>

        <button
          onClick={handleCheckStatus}
          className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
        >
          Проверить статус
        </button>
      </div>

      {result && (
        <div className={`mt-4 p-3 rounded ${
          result.ok ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'
        }`}>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}