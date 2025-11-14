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
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const loadStats = async () => {
    try {
      const days = selectedPeriod === 'week' ? 7 : 30;
      const response = await fetch(`/api/cash-days?days=${days}`);
      const result = await response.json();
      
      if (result.ok) {
        const realStats = calculateRealStats(result.data, days);
        setStats(realStats);
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
      // Fallback на заглушку если API не работает
      setStats(getFallbackStats());
    } finally {
      setLoading(false);
    }
  };

  const calculateRealStats = (cashDays: any[], periodDays: number): WeeklyStats => {
    // Фильтруем только закрытые дни и преобразуем данные
    const closedDays = cashDays
      .filter(day => day.isClosed)
      .map(day => {
        const salesEvents = day.events.filter((event: any) => event.type === 'SALE');
        const returnEvents = day.events.filter((event: any) => event.type === 'RETURN');
        
        return {
          date: day.date,
          total: day.total,
          salesCount: salesEvents.length,
          returnsCount: returnEvents.length,
          averageTicket: salesEvents.length > 0 ? day.total / salesEvents.length : 0
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, periodDays); // Берем только последние N дней

    const weekTotal = closedDays.reduce((sum, day) => sum + day.total, 0);
    const weekAverage = closedDays.length > 0 ? weekTotal / closedDays.length : 0;
    
    const bestDay = closedDays.length > 0 
      ? closedDays.reduce((best, day) => day.total > best.total ? day : best, closedDays[0])
      : null;

    return {
      days: closedDays,
      weekTotal,
      weekAverage,
      bestDay
    };
  };

  const getFallbackStats = (): WeeklyStats => {
    // Заглушка только если API полностью не работает
    return {
      days: [],
      weekTotal: 0,
      weekAverage: 0,
      bestDay: null
    };
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
      month: 'short'
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
          Не удалось загрузить данные
        </p>
        <button 
          onClick={loadStats}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Повторить загрузку
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и переключатель периода */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            📊 Статистика продаж
          </h2>
          <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              7 дней
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              30 дней
            </button>
          </div>
        </div>
        
        {/* Общая статистика */}
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
              {stats.bestDay ? formatCurrency(stats.bestDay.total) : '0'}
            </div>
            <div className="text-sm text-orange-600">Лучший день</div>
          </div>
        </div>

        {/* Информация о данных */}
        <div className="text-sm text-gray-600 text-center">
          {stats.days.length === 0 ? (
            <p>Нет данных за выбранный период</p>
          ) : (
            <p>Показано {stats.days.length} закрытых дней</p>
          )}
        </div>
      </div>

      {/* Таблица по дням - только если есть данные */}
      {stats.days.length > 0 && (
        <>
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
                            {stats.bestDay && day.date === stats.bestDay.date ? '🏆' : '📅'}
                          </span>
                          <div className="text-sm font-medium text-gray-900">
                            {getDayName(day.date)}
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
              </table>
            </div>
          </div>

          {/* График выручки */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Визуализация выручки по дням
            </h3>
            
            <div className="flex items-end justify-between h-48 space-x-2 px-4">
              {stats.days.map((day) => {
                const maxRevenue = Math.max(...stats.days.map(d => d.total));
                const height = maxRevenue > 0 ? (day.total / maxRevenue) * 80 : 0;
                
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
        </>
      )}
    </div>
  );
}