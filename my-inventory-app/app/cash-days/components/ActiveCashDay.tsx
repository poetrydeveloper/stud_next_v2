// app/cash-days/components/ActiveCashDay.tsx
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

export default function ActiveCashDay() {
  const [cashDay, setCashDay] = useState<CashDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    loadCurrentCashDay();
  }, []);

  const loadCurrentCashDay = async () => {
    try {
      const response = await fetch("/api/cash-days/current");
      const data = await response.json();
      
      if (data.ok) {
        setCashDay(data.data);
      } else {
        setCashDay(null);
      }
    } catch (error) {
      console.error("Ошибка загрузки кассового дня:", error);
      setCashDay(null);
    } finally {
      setLoading(false);
    }
  };

  const openCashDay = async () => {
    try {
      setIsOpening(true);
      const response = await fetch("/api/cash-days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await response.json();
      
      if (data.ok) {
        await loadCurrentCashDay();
      } else {
        alert("Ошибка открытия дня: " + data.error);
      }
    } catch (error) {
      alert("Ошибка сети");
    } finally {
      setIsOpening(false);
    }
  };

  const closeCashDay = async () => {
    if (!cashDay || !confirm("Закрыть кассовый день? После закрытия нельзя будет добавлять новые операции.")) {
      return;
    }

    try {
      setIsClosing(true);
      const response = await fetch(`/api/cash-days/${cashDay.id}/close`, {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (data.ok) {
        await loadCurrentCashDay();
        alert("Кассовый день закрыт!");
      } else {
        alert("Ошибка закрытия дня: " + data.error);
      }
    } catch (error) {
      alert("Ошибка сети");
    } finally {
      setIsClosing(false);
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Если день не открыт
  if (!cashDay) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">💸</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Кассовый день не открыт
          </h3>
          <p className="text-gray-600 mb-6">
            Откройте кассовый день чтобы начать работу с продажами
          </p>
          <button
            onClick={openCashDay}
            disabled={isOpening}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2 mx-auto"
          >
            {isOpening ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>📅</span>
                <span>Открыть кассовый день</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const calculatedTotal = cashDay.events.reduce((sum, event) => sum + event.amount, 0);

  return (
    <div className="space-y-6">
      {/* Шапка активного дня */}
      <div className="bg-white rounded-lg border border-green-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              🟢 Активный кассовый день
            </h2>
            <p className="text-gray-600">
              {new Date(cashDay.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(calculatedTotal)}
            </div>
            <div className="text-sm text-gray-600">
              {cashDay.events.length} операций
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/store"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🏪 Перейти в магазин
          </Link>
          <button
            onClick={closeCashDay}
            disabled={isClosing}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isClosing ? "Закрываем..." : "❌ Закрыть день"}
          </button>
          <button
            onClick={loadCurrentCashDay}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            🔄 Обновить
          </button>
        </div>
      </div>

      {/* События активного дня */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            📋 Операции дня ({cashDay.events.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {cashDay.events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-500">Операций пока нет</p>
              <p className="text-sm text-gray-400 mt-1">
                Перейдите в магазин чтобы совершить первую продажу
              </p>
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
  );
}