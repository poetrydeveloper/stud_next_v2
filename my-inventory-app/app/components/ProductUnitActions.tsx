// app/components/ProductUnitActions.tsx

"use client";

import { useState } from "react";

interface ProductUnit {
  id: number;
  statusProduct: "IN_STORE" | "SOLD" | "CREDIT" | "LOST" | null;
  isReturned: boolean;
  salePrice?: number | null;
  isCredit: boolean;
  buyerName?: string | null;
  buyerPhone?: string | null;
}

interface Props {
  unit: ProductUnit;
  onUpdate?: (updatedUnit: ProductUnit) => void; // callback после обновления
}

export default function ProductUnitActions({ unit, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "sell" | "return" | "creditPay") => {
    setLoading(true);
    try {
      let body: any = { action };

      // Для продажи в кредит или обычной продажи можно запросить данные покупателя и цену
      if (action === "sell") {
        const buyerName = prompt("Имя покупателя") || "";
        const buyerPhone = prompt("Телефон покупателя") || "";
        const salePriceStr = prompt("Цена продажи (0 для кредита)") || "0";
        const salePrice = parseFloat(salePriceStr);
        body = { ...body, buyerName, buyerPhone, salePrice };
      }

      const res = await fetch(`/api/product-units/${unit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.ok && onUpdate) {
        onUpdate(data.data);
      } else if (!data.ok) {
        alert("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка при выполнении действия");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      {unit.statusProduct === "IN_STORE" && !unit.isReturned && (
        <>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            onClick={() => handleAction("sell")}
            disabled={loading}
          >
            Продать / Кредит
          </button>
          <button
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
            onClick={() => handleAction("return")}
            disabled={loading}
          >
            Отметить как возвращенный
          </button>
        </>
      )}

      {unit.isCredit && unit.statusProduct === "CREDIT" && (
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={() => handleAction("creditPay")}
          disabled={loading}
        >
          Погасить долг
        </button>
      )}

      {unit.statusProduct === "SOLD" && !unit.isCredit && (
        <div className="text-sm text-gray-500">
          Продано: {unit.buyerName} {unit.buyerPhone} - {unit.salePrice} ₽
        </div>
      )}

      {unit.isReturned && (
        <div className="text-sm text-red-500">Возврат оформлен</div>
      )}
    </div>
  );
}
