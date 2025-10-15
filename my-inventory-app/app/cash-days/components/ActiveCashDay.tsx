// app/cash-days/components/ActiveCashDay.tsx
"use client";
import { useState, useEffect } from "react";
import { CashDay } from './types';
import { cashDayApi } from './helpers/cashDayApi';
import ActiveCashDayHeader from './ActiveCashDayHeader';
import CashEventItem from './CashEventItem';
import NoCashDayState from './NoCashDayState';
import LoadingState from './LoadingState';

export default function ActiveCashDay() {
  const [cashDay, setCashDay] = useState<CashDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isClosingPast, setIsClosingPast] = useState(false);
  const [pastDaysStats, setPastDaysStats] = useState<any>(null);

  useEffect(() => {
    loadCurrentCashDay();
    loadPastDaysStats();
  }, []);

  const loadCurrentCashDay = async () => {
    try {
      const currentCashDay = await cashDayApi.getCurrent();
      setCashDay(currentCashDay);
    } catch (error) {
      console.error("Ошибка загрузки кассового дня:", error);
      setCashDay(null);
    } finally {
      setLoading(false);
    }
  };

  const loadPastDaysStats = async () => {
    try {
      const response = await fetch('/api/cash-days/close-past');
      if (response.ok) {
        const data = await response.json();
        setPastDaysStats(data.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    }
  };

  const openCashDay = async () => {
    try {
      setIsOpening(true);
      const success = await cashDayApi.open();
      if (success) {
        await loadCurrentCashDay();
      } else {
        alert("Ошибка открытия дня");
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
      const success = await cashDayApi.close(cashDay.id);
      if (success) {
        await loadCurrentCashDay();
        alert("Кассовый день закрыт!");
      } else {
        alert("Ошибка закрытия дня");
      }
    } catch (error) {
      alert("Ошибка сети");
    } finally {
      setIsClosing(false);
    }
  };

  const closePastCashDays = async () => {
    if (!pastDaysStats?.count) {
      alert("Нет незакрытых прошлых дней");
      return;
    }

    const confirmMessage = `Найдено ${pastDaysStats.count} незакрытых дней:\n\n${
      pastDaysStats.days.map((day: any) => 
        `• ${new Date(day.date).toLocaleDateString()} (${day.eventsCount} операций)`
      ).join('\n')
    }\n\nЗакрыть все эти дни?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setIsClosingPast(true);
      const response = await fetch('/api/cash-days/close-past', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.ok) {
        alert(result.message);
        await loadCurrentCashDay();
        await loadPastDaysStats();
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      alert("Ошибка сети при закрытии дней");
    } finally {
      setIsClosingPast(false);
    }
  };

  const handleReturn = async (eventId: number, productUnitId: number, productName: string) => {
    const returnReason = prompt(`Укажите причину возврата для "${productName}":`, "Возврат товара");
    
    if (!returnReason) return;

    try {
      const success = await cashDayApi.returnProduct(productUnitId, returnReason);
      if (success) {
        alert("Товар успешно возвращен!");
        await loadCurrentCashDay();
      } else {
        alert("Ошибка возврата");
      }
    } catch (error) {
      console.error("Ошибка возврата:", error);
      alert("Произошла ошибка при возврате товара");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!cashDay) {
    return <NoCashDayState isOpening={isOpening} onOpen={openCashDay} />;
  }

  const calculatedTotal = cashDay.events.reduce((sum, event) => sum + event.amount, 0);

  return (
    <div className="space-y-6">
      <ActiveCashDayHeader
        cashDay={cashDay}
        calculatedTotal={calculatedTotal}
        isClosing={isClosing}
        onClose={closeCashDay}
        onReload={loadCurrentCashDay}
      />

      {/* Панель закрытия прошлых дней */}
      {pastDaysStats && pastDaysStats.count > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
                ⚠️ Незакрытые прошлые дни
              </h3>
              <p className="text-yellow-700 text-sm mt-1">
                Найдено {pastDaysStats.count} незакрытых кассовых дней
              </p>
              <div className="text-yellow-600 text-xs mt-2">
                {pastDaysStats.days.slice(0, 3).map((day: any) => (
                  <div key={day.id}>
                    {new Date(day.date).toLocaleDateString()} ({day.eventsCount} операций)
                  </div>
                ))}
                {pastDaysStats.count > 3 && (
                  <div>... и еще {pastDaysStats.count - 3} дней</div>
                )}
              </div>
            </div>
            <button
              onClick={closePastCashDays}
              disabled={isClosingPast}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isClosingPast ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Закрытие...
                </>
              ) : (
                <>
                  🔒 Закрыть все ({pastDaysStats.count})
                </>
              )}
            </button>
          </div>
        </div>
      )}

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
            cashDay.events
              .slice() // создаем копию массива
              .reverse() // переворачиваем порядок (новые внизу)
              .map((event) => (
                <CashEventItem
                  key={event.id}
                  event={event}
                  onReturn={handleReturn}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}