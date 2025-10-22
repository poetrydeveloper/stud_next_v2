// app/components/ProductUnitActions.tsx
"use client";

import { useState } from "react";
import { ProductUnit } from "@/types/product-unit";

interface ProductUnitActionsProps {
  unit: ProductUnit;
  onUpdate: (updatedUnit: ProductUnit) => void;
}

export default function ProductUnitActions({ unit, onUpdate }: ProductUnitActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Универсальный обработчик действий (из старого компонента)
  const handleAction = async (action: "sell" | "return" | "creditPay" | "addToCandidate" | "changeStatus") => {
    setLoading(true);
    setError("");

    try {
      let body: any = { action };

      // Продажа/кредит (улучшенная логика из старого компонента)
      if (action === "sell") {
        const buyerName = prompt("Имя покупателя:") || "";
        const buyerPhone = prompt("Телефон покупателя:") || "";
        const salePriceStr = prompt("Цена продажи (0 для кредита):") || "0";
        const salePrice = parseFloat(salePriceStr);
        
        if (!buyerName || !buyerPhone) {
          setError("Имя и телефон покупателя обязательны");
          setLoading(false);
          return;
        }

        body = { 
          ...body, 
          buyerName, 
          buyerPhone, 
          salePrice,
          statusProduct: salePrice === 0 ? "CREDIT" : "SOLD"
        };
      }

      // Добавление в кандидаты (из нового компонента)
      if (action === "addToCandidate") {
        const quantity = prompt("Введите количество для кандидата:", "1");
        if (!quantity || isNaN(parseInt(quantity))) {
          setError("Введите корректное количество");
          setLoading(false);
          return;
        }
        body = { ...body, quantity: parseInt(quantity) };
      }

      // Смена статуса (из нового компонента)
      if (action === "changeStatus") {
        const newStatus = prompt("Введите новый статус (IN_STORE, SOLD, CREDIT, LOST, RETURNED):");
        if (!newStatus) {
          setLoading(false);
          return;
        }
        body = { ...body, statusProduct: newStatus };
      }

      const response = await fetch(`/api/product-units/${unit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const updatedUnit = await response.json();
        onUpdate(updatedUnit);
        
        // Показать уведомление об успехе
        if (action === "addToCandidate") {
          alert("Успешно добавлено в кандидаты");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update unit");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error processing action");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {/* Основные действия (из старого компонента) */}
        {unit.statusProduct === "IN_STORE" && !unit.isReturned && (
          <>
            <button
              className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm font-medium"
              onClick={() => handleAction("sell")}
              disabled={loading}
            >
              Продать / Кредит
            </button>
            
            <button
              className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 text-sm font-medium"
              onClick={() => handleAction("return")}
              disabled={loading}
            >
              Отметить как возвращенный
            </button>
          </>
        )}

        {/* Погашение кредита (из старого компонента) */}
        {unit.isCredit && unit.statusProduct === "CREDIT" && (
          <button
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm font-medium"
            onClick={() => handleAction("creditPay")}
            disabled={loading}
          >
            Погасить долг
          </button>
        )}

        {/* Добавление в кандидаты (из нового компонента) */}
        {unit.statusCard !== 'CANDIDATE' && unit.statusProduct === "IN_STORE" && (
          <button
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 text-sm font-medium"
            onClick={() => handleAction("addToCandidate")}
            disabled={loading}
          >
            Добавить в кандидаты
          </button>
        )}

        {/* Смена статуса (из нового компонента) */}
        <button
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-sm font-medium"
          onClick={() => handleAction("changeStatus")}
          disabled={loading}
        >
          Сменить статус
        </button>

        {/* Информация о продаже (из старого компонента) */}
        {unit.statusProduct === "SOLD" && !unit.isCredit && (
          <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
            <div><strong>Продано:</strong> {unit.buyerName} {unit.buyerPhone}</div>
            <div><strong>Цена:</strong> {unit.salePrice} ₽</div>
          </div>
        )}

        {/* Информация о возврате (из старого компонента) */}
        {unit.isReturned && (
          <div className="text-sm text-red-600 p-2 bg-red-50 rounded">
            Возврат оформлен
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center text-gray-600 text-sm">
          Загрузка...
        </div>
      )}
    </div>
  );
}