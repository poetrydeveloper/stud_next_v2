// app/cash-days/components/WeeklyStats.tsx
"use client";

import { useState, useEffect } from "react";

interface DailyStats {
  date: string;
  total: number;
  salesCount: number;
  returnsCount: number;
  averageTicket: number;
}

interface WeeklyStats {
  days: DailyStats[];
  weekTotal: number;
  weekAverage: number;
  bestDay: DailyStats | null;
}

export default function WeeklyStats() {
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyStats();
  }, []);

  const loadWeeklyStats = async () => {
    try {
      // В реальном приложении здесь будет вызов API
      // const response = await fetch("/api/cash-days/weekly-stats");
      
      // Заглушка с моковыми данными
      const mockStats: WeeklyStats = {
        days: [
          { date: '2024-10-07', total: 15000, salesCount: 8, returnsCount: 1, averageTicket: 1875 },
          { date: '2024-10-08', total: 22000, salesCount: 12, returnsCount: 0, averageTicket: 1833 },
          { date: '2024-10-09', total: 18000, salesCount: 10, returnsCount: 2, averageTicket: 1800 },
          { date: '2024-10-10', total: 25000, salesCount: 15, returnsCount: 1, averageTicket: 1667 },
          { date: '2024-10-11', total: 19000, salesCount: 11, returnsCount: 0, averageTicket: 1727 },
          { date: '2024-10-12', total: 28000, salesCount: 16, returnsCount: 3, averageTicket: 1750 },
          { date: '2024-10-13', total: 12000, salesCount: 7, returnsCount: 1, averageTicket: 1714 },
        ],
        weekTotal: 139000,
        weekAverage: 19857,
        bestDay: { date: '2024-10-12', total: 28000, salesCount: 16, returnsCount: 3, averageTicket: 1750 }
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      weekday: 'short'
    });
  };

  const getDayName = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', { weekday: 'long' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Статистика недоступна
        </h3>
        <p className="text-gray-600">
          Не удалось загрузить данные за неделю
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Общая статистика недели */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📊 Статистика за неделю
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(stats.weekTotal)}
            </div>
            <div className="text-sm text-green-600">Общая выручка</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(stats.weekAverage)}
            </div>
            <div className="text-sm text-blue-600">Среднедневная</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">
              {stats.days.reduce((sum, day) => sum + day.salesCount, 0)}
            </div>
            <div className="text-sm text-purple-600">Всего продаж</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-900">
              {stats.bestDay ? formatDate(stats.bestDay.date) : '-'}
            </div>
            <div className="text-sm text-orange-600">Лучший день</div>
          </div>
        </div>
      </div>

      {/* Таблица по дням */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            📈 Детальная статистика по дням
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  День недели
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Выручка
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Продажи
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Возвраты
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Средний чек
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.days.map((day, index) => (
                <tr 
                  key={day.date} 
                  className={`hover:bg-gray-50 transition-colors ${
                    stats.bestDay && day.date === stats.bestDay.date ? 'bg-green-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {index === 0 ? '🟢' : '⚫'}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getDayName(day.date)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(day.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(day.total)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">
                      {day.salesCount} шт.
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm ${
                      day.returnsCount > 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {day.returnsCount} шт.
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(day.averageTicket)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={2} className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Итого за неделю:
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(stats.weekTotal)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {stats.days.reduce((sum, day) => sum + day.salesCount, 0)} шт.
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {stats.days.reduce((sum, day) => sum + day.returnsCount, 0)} шт.
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(stats.weekAverage)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* График выручки (простая визуализация) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Визуализация выручки по дням
        </h3>
        
        <div className="flex items-end justify-between h-48 space-x-2">
          {stats.days.map((day, index) => {
            const maxRevenue = Math.max(...stats.days.map(d => d.total));
            const height = (day.total / maxRevenue) * 80; // 80% от максимальной высоты
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-t transition-all ${
                    stats.bestDay && day.date === stats.bestDay.date 
                      ? 'bg-green-500' 
                      : 'bg-blue-500'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  <div>{formatDate(day.date).split(' ')[0]}</div>
                  <div className="font-semibold">{formatCurrency(day.total)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}