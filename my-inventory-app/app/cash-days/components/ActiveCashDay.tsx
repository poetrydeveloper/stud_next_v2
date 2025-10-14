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

  useEffect(() => {
    loadCurrentCashDay();
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