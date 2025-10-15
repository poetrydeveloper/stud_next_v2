// app/components/inventory/InventoryMovement.tsx
"use client";
import { useState, useEffect } from 'react';

interface MovementDetail {
  type: string;
  product: string;
  message?: string;
  amount?: number;
  timestamp: string;
}

interface DailyMovement {
  date: string;
  arrivals: number;
  sales: number;
  returns: number;
  details: MovementDetail[];
}

interface MovementData {
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
  summary: {
    totalArrivals: number;
    totalSales: number;
    totalReturns: number;
  };
  dailyMovement: DailyMovement[];
}

export default function InventoryMovement() {
  const [data, setData] = useState<MovementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const loadMovement = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/inventory/movement?days=${days}`);
      const result = await response.json();
      
      if (result.ok) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error loading movement data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovement();
  }, [days]);

  if (loading) {
    return <div className="text-center py-8">Загрузка движения товаров...</div>;
  }

  if (!data) {
    return <div>Ошибка загрузки данных</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📈 Движение товаров</h1>
        <select 
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          <option value={7}>За 7 дней</option>
          <option value={30}>За 30 дней</option>
          <option value={90}>За 90 дней</option>
        </select>
      </div>

      {/* KPI карточки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{data.summary.totalArrivals}</div>
          <div className="text-green-700">Поступления</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{data.summary.totalSales}</div>
          <div className="text-blue-700">Продажи</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{data.summary.totalReturns}</div>
          <div className="text-orange-700">Возвраты</div>
        </div>
      </div>

      {/* Детали по дням */}
      <div className="space-y-4">
        {data.dailyMovement.map((day) => (
          <div key={day.date} className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">
                {new Date(day.date).toLocaleDateString('ru-RU')}
              </h3>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">+{day.arrivals}</span>
                <span className="text-blue-600">-{day.sales}</span>
                <span className="text-orange-600">↩{day.returns}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {day.details.slice(0, 5).map((detail, index) => (
                <div key={index} className="flex justify-between text-sm border-b pb-1">
                  <div>
                    <span className={
                      detail.type === 'SALE' ? 'text-blue-600' : 
                      detail.type === 'STATUS_CHANGE' ? 'text-gray-600' : 'text-orange-600'
                    }>
                      {detail.product}
                    </span>
                    {detail.message && (
                      <span className="text-gray-500 ml-2">- {detail.message}</span>
                    )}
                  </div>
                  <div className="text-gray-400">
                    {new Date(detail.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {day.details.length > 5 && (
                <div className="text-center text-gray-500 text-sm">
                  ... и еще {day.details.length - 5} операций
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}