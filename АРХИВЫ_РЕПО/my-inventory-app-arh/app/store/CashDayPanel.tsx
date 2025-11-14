// app/store/CashDayPanel.tsx
"use client";

import { useState, useEffect } from "react";

interface CashEvent {
  id: number;
  type: string;
  amount: number;
  notes: string;
  createdAt: string;
  productUnit?: {
    id: number;
    productName?: string;
    serialNumber: string;
  };
}

interface CashDay {
  id: number;
  date: string;
  isClosed: boolean;
  total: number;
  events: CashEvent[];
}

export default function CashDayPanel() {
  const [cashDay, setCashDay] = useState<CashDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);

  // Загрузка текущего кассового дня
  useEffect(() => {
    loadCurrentCashDay();
  }, []);

  const loadCurrentCashDay = async () => {
    try {
      setLoading(true);
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

  // Открыть новый кассовый день
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

  // Закрыть кассовый день
  const closeCashDay = async () => {
    if (!cashDay) return;
    
    if (!confirm("Закрыть кассовый день? После закрытия нельзя будет добавлять новые операции.")) {
      return;
    }

    try {
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
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">💰</span>
          Кассовый день
        </h3>
        
        {cashDay && !cashDay.isClosed && (
          <button
            onClick={closeCashDay}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            Закрыть день
          </button>
        )}
      </div>

      {/* Состояние кассового дня */}
      {!cashDay ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-2">💸</div>
          <p className="text-gray-600 mb-4">Кассовый день не открыт</p>
          <button
            onClick={openCashDay}
            disabled={isOpening}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isOpening ? "Открываем..." : "📅 Открыть кассовый день"}
          </button>
        </div>
      ) : (
        <div>
          {/* Информация о дне */}
          <div className={`p-3 rounded-lg mb-4 ${
            cashDay.isClosed ? 'bg-gray-100' : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-900">
                  {formatDate(cashDay.date)}
                </div>
                <div className={`text-sm ${
                  cashDay.isClosed ? 'text-gray-600' : 'text-green-700'
                }`}>
                  {cashDay.isClosed ? '✅ Закрыт' : '🟢 Открыт'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(cashDay.total)}
                </div>
                <div className="text-sm text-gray-600">
                  {cashDay.events.length} операций
                </div>
              </div>
            </div>
          </div>

          {/* Список событий */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              📋 События дня
            </h4>
            
            {cashDay.events.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <div className="text-2xl mb-2">📭</div>
                <p className="text-sm">Операций пока нет</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cashDay.events.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          event.type === 'SALE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {event.type === 'SALE' ? '💰 Продажа' : event.type}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(event.amount)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTime(event.createdAt)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {event.notes}
                    </div>
                    
                    {event.productUnit && (
                      <div className="text-xs text-gray-500 mt-1">
                        📦 {event.productUnit.productName} 
                        <span className="ml-2 font-mono">
                          ({event.productUnit.serialNumber})
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}