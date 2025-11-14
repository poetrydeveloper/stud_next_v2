// app/components/ProductUnitItem_v2.tsx
"use client";

import { useState } from "react";
import ProductUnitStatusPanel_v2 from "./ProductUnitStatusPanel_v2";

export default function ProductUnitItem_v2({ unit }) {
  const [status, setStatus] = useState(unit.statusCard);

  return (
    <div className="border rounded-lg p-3 flex flex-col gap-3 bg-gray-50 hover:bg-gray-100 transition">
      {/* Верхняя строка: название и статус */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">
            {unit.productName || unit.product?.name || "Без названия"}
          </p>
          <p className="text-xs text-gray-500">
            Серийный: {unit.serialNumber}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded ${
            status === "CLEAR"
              ? "bg-green-100 text-green-700"
              : status === "CANDIDATE"
              ? "bg-yellow-100 text-yellow-700"
              : status === "IN_REQUEST"
              ? "bg-blue-100 text-blue-700"
              : status === "SPROUTED"
              ? "bg-purple-100 text-purple-700"
              : status === "IN_DELIVERY"
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Панель управления статусом */}
      <ProductUnitStatusPanel_v2 unit={unit} onStatusChange={setStatus} />

      {/* Если статус CANDIDATE → ввод количества и заказ */}
      {status === "CANDIDATE" && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            placeholder="Количество"
            className="w-20 px-2 py-1 text-sm border rounded"
          />
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            Заказать
          </button>
        </div>
      )}

      {/* Если unit имеет детей → показать список */}
      {unit.childProductUnits && unit.childProductUnits.length > 0 && (
        <div className="mt-2 pl-3 border-l-2 border-gray-300">
          <p className="text-xs text-gray-500 mb-1">Производные заявки:</p>
          <div className="space-y-1">
            {unit.childProductUnits.map((child) => (
              <div
                key={child.id}
                className="text-xs text-gray-600 flex justify-between"
              >
                <span>{child.productName || child.product?.name}</span>
                <span>{child.statusCard}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
