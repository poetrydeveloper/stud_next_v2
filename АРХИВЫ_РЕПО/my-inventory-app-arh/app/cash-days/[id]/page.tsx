// app/cash-days/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function CashDayDetailPage() {
  const params = useParams();
  const cashDayId = params.id as string;
  
  const [cashDay, setCashDay] = useState<CashDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    loadCashDay();
  }, [cashDayId]);

  const loadCashDay = async () => {
    try {
      const response = await fetch(`/api/cash-days/${cashDayId}`);
      const data = await response.json();
      
      if (data.ok) {
        setCashDay(data.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки кассового дня:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeCashDay = async () => {
    if (!cashDay || !confirm("Закрыть кассовый день? После закрытия нельзя будет добавлять новые операции.")) {
      return;
    }

    try {
      setClosing(true);
      const response = await fetch(`/api/cash-days/${cashDayId}/close`, {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (data.ok) {
        await loadCashDay();
        alert("Кассовый день закрыт!");
      } else {
        alert("Ошибка закрытия дня: " + data.error);
      }
    } catch (error) {
      alert("Ошибка сети");
    } finally {
      setClosing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
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

  // Считаем общую сумму правильно
  const calculatedTotal = cashDay?.events.reduce((sum, event) => sum + event.amount, 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!cashDay) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Кассовый день не найден</h2>
          <Link
            href="/cash-days"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Назад к списку дней
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Шапка */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <Link
                  href="/cash-days"
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ← Назад
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                  Кассовый день
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-xl text-gray-600">
                  {new Date(cashDay.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    weekday: 'long'
                  })}
                </p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  cashDay.isClosed 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {cashDay.isClosed ? '✅ Закрыт' : '🟢 Открыт'}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(calculatedTotal)}
              </div>
              <div className="text-sm text-gray-600">
                {cashDay.events.length} операций
                {cashDay.total !== calculatedTotal && (
                  <span className="text-orange-600 ml-2">
                    (расчет: {formatCurrency(calculatedTotal)})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Основной контент - события */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Заголовок таблицы */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  📋 Операции дня
                </h2>
              </div>

              {/* Список событий */}
              <div className="divide-y divide-gray-200">
                {cashDay.events.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-gray-500">Операций пока нет</p>
                  </div>
                ) : (
                  cashDay.events.map((event) => {
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

                            {/* Описание */}
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
                                          Цена: {formatCurrency(event.productUnit.salePrice)}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Кнопки действий */}
                                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                                    {event.type === 'SALE' && (
                                      <>
                                        <button
                                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                          onClick={() => alert("Функция возврата в разработке")}
                                        >
                                          🔄 Возврат
                                        </button>
                                        <button
                                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                          onClick={() => alert("Функция перезаказа в разработке")}
                                        >
                                          📦 Заказать
                                        </button>
                                      </>
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
            </div>
          </div>

          {/* Боковая панель */}
          <div className="lg:col-span-1 space-y-6">
            {/* Статистика */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📊 Статистика
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Всего операций:</span>
                  <span className="font-semibold">{cashDay.events.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Продажи:</span>
                  <span className="font-semibold text-green-600">
                    {cashDay.events.filter(e => e.type === 'SALE').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Возвраты:</span>
                  <span className="font-semibold text-red-600">
                    {cashDay.events.filter(e => e.type === 'RETURN').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Действия */}
            {!cashDay.isClosed && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ⚡ Действия
                </h3>
                <button
                  onClick={closeCashDay}
                  disabled={closing}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                  {closing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>❌</span>
                      <span>Закрыть день</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Быстрые ссылки */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🔗 Ссылки
              </h3>
              <div className="space-y-2">
                <Link
                  href="/store"
                  className="block w-full text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🏪 Перейти в магазин
                </Link>
                <Link
                  href="/cash-days"
                  className="block w-full text-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  📅 Все кассовые дни
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}