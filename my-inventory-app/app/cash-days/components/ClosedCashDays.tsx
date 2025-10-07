// app/cash-days/components/ClosedCashDays.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CashEvent {
  id: number;
  type: string;
  amount: number;
  notes: string;
  createdAt: string;
  productUnit?: {
    id: number;
    serialNumber: string;
    productName?: string;
    productCode?: string;
    salePrice?: number;
    product?: {
      name: string;
      code: string;
      images?: Array<{
        path: string;
        isMain: boolean;
      }>;
    };
  };
}

interface CashDay {
  id: number;
  date: string;
  isClosed: boolean;
  total: number;
  events: CashEvent[];
}

export default function ClosedCashDays() {
  const [cashDays, setCashDays] = useState<CashDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [reordering, setReordering] = useState<number | null>(null);

  useEffect(() => {
    loadClosedCashDays();
  }, [selectedWeek]);

  const loadClosedCashDays = async () => {
    try {
      const response = await fetch("/api/cash-days");
      const data = await response.json();
      
      if (data.ok) {
        // Фильтруем только закрытые дни и сортируем по дате
        const closedDays = data.data
          .filter((day: CashDay) => day.isClosed)
          .sort((a: CashDay, b: CashDay) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setCashDays(closedDays);
      }
    } catch (error) {
      console.error("Ошибка загрузки закрытых дней:", error);
    } finally {
      setLoading(false);
    }
  };

  // Функция перезаказа товара
  const handleReorder = async (productUnitId: number) => {
    try {
      setReordering(productUnitId);
      
      // Здесь будет логика перезаказа
      // Пока просто имитируем запрос
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Товар добавлен в заявку на перезаказ!");
    } catch (error) {
      alert("Ошибка при перезаказе товара");
    } finally {
      setReordering(null);
    }
  };

  const getCurrentWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return { monday, sunday };
  };

  const getFilteredDays = () => {
    if (selectedWeek === 0) {
      const { monday, sunday } = getCurrentWeekDays();
      return cashDays.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= monday && dayDate <= sunday;
      });
    } else {
      return cashDays;
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
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeConfig = (type: string) => {
    const config: Record<string, { bg: string; text: string; icon: string; label: string }> = {
      SALE: { bg: "bg-green-100", text: "text-green-800", icon: "💰", label: "Продажа" },
      RETURN: { bg: "bg-red-100", text: "text-red-800", icon: "🔄", label: "Возврат" },
      ORDER: { bg: "bg-blue-100", text: "text-blue-800", icon: "📦", label: "Заказ" },
      PRICE_QUERY: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "💬", label: "Запрос цены" }
    };
    return config[type] || { bg: "bg-gray-100", text: "text-gray-800", icon: "📝", label: type };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredDays = getFilteredDays();

  return (
    <div className="space-y-6">
      {/* Заголовок и фильтры */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              📅 Закрытые кассовые дни
            </h2>
            <p className="text-gray-600">
              Просмотр истории операций и управление перезаказами
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Текущая неделя</option>
              <option value={1}>Все дни</option>
            </select>
            <button
              onClick={loadClosedCashDays}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              🔄 Обновить
            </button>
          </div>
        </div>
      </div>

      {/* Список закрытых дней */}
      {filteredDays.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Нет закрытых дней
          </h3>
          <p className="text-gray-600">
            {selectedWeek === 0 
              ? 'На текущей неделе еще нет закрытых кассовых дней' 
              : 'В системе нет закрытых кассовых дней'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDays.map((day) => (
            <div 
              key={day.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* Шапка дня */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {formatDate(day.date)}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        ✅ Закрыт
                      </span>
                      <span className="text-sm text-gray-600">
                        {day.events.length} операций
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(day.total)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Общая выручка
                    </div>
                  </div>
                </div>
              </div>

              {/* События дня */}
              <div className="divide-y divide-gray-200">
                {day.events.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-gray-500">Операций не было</p>
                  </div>
                ) : (
                  day.events.map((event) => {
                    const typeConfig = getEventTypeConfig(event.type);
                    
                    return (
                      <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4">
                          {/* Изображение товара */}
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                            {event.productUnit?.product?.images?.[0] ? (
                              <img
                                src={event.productUnit.product.images[0].path}
                                alt={event.productUnit.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="text-2xl">📦</span>
                              </div>
                            )}
                          </div>

                          {/* Информация о событии */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${typeConfig.bg} ${typeConfig.text}`}>
                                  <span className="mr-1">{typeConfig.icon}</span>
                                  {typeConfig.label}
                                </span>
                                <span className="text-lg font-semibold text-gray-900">
                                  {formatCurrency(event.amount)}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500 flex-shrink-0">
                                {formatDateTime(event.createdAt)}
                              </span>
                            </div>

                            <p className="text-gray-700 mb-3">
                              {event.notes}
                            </p>

                            {/* Информация о товаре */}
                            {event.productUnit && (
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                                        {event.productUnit.productName || event.productUnit.product?.name || "Без названия"}
                                      </h4>
                                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border font-mono">
                                        {event.productUnit.serialNumber}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                                      <span>Арт: {event.productUnit.productCode || event.productUnit.product?.code || "—"}</span>
                                      {event.productUnit.salePrice && (
                                        <span className="text-green-600 font-semibold">
                                          Цена продажи: {formatCurrency(event.productUnit.salePrice)}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Кнопки действий для продаж */}
                                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                                    {event.type === 'SALE' && (
                                      <button
                                        onClick={() => handleReorder(event.productUnit!.id)}
                                        disabled={reordering === event.productUnit!.id}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-1"
                                      >
                                        {reordering === event.productUnit!.id ? (
                                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <span>📦</span>
                                        )}
                                        <span>Перезаказать</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Футер дня */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Всего операций: {day.events.length} • 
                    Продажи: {day.events.filter(e => e.type === 'SALE').length} • 
                    Сумма: {formatCurrency(day.total)}
                  </div>
                  <Link
                    href={`/cash-days/${day.id}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📊 Полный отчет
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Статистика по закрытым дням */}
      {filteredDays.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📈 Сводка по {selectedWeek === 0 ? 'неделе' : 'всем дням'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {filteredDays.length}
              </div>
              <div className="text-sm text-gray-600">Дней</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(filteredDays.reduce((sum, day) => sum + day.total, 0))}
              </div>
              <div className="text-sm text-green-600">Общая выручка</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">
                {filteredDays.reduce((sum, day) => sum + day.events.filter(e => e.type === 'SALE').length, 0)}
              </div>
              <div className="text-sm text-blue-600">Продаж</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-900">
                {formatCurrency(
                  filteredDays.reduce((sum, day) => sum + day.total, 0) / 
                  filteredDays.reduce((sum, day) => sum + day.events.filter(e => e.type === 'SALE').length, 1)
                )}
              </div>
              <div className="text-sm text-purple-600">Средний чек</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}