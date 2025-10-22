// app/components/ProductUnitSummaryPanel.tsx
"use client";

import { useState } from "react";
import LogsPanel_v2 from "./LogsPanel_v2";
import ProductUnitStatusPanel_v2 from "./ProductUnitStatusPanel_v2";

export default function ProductUnitSummaryPanel({ unit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-2 bg-gray-50 mb-2">
      {/* Верхняя строка: название + серийный номер + статус */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">
            {unit.productName || unit.product?.name || "Без названия"}
          </p>
          <p className="text-xs text-gray-500">Серийный: {unit.serialNumber}</p>
        </div>
        <span
          className={`px-2 py-0.5 text-xs rounded ${
            unit.statusCard === "CLEAR"
              ? "bg-green-100 text-green-700"
              : unit.statusCard === "CANDIDATE"
              ? "bg-yellow-100 text-yellow-700"
              : unit.statusCard === "IN_REQUEST"
              ? "bg-blue-100 text-blue-700"
              : unit.statusCard === "SPROUTED"
              ? "bg-purple-100 text-purple-700"
              : unit.statusCard === "IN_DELIVERY"
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {unit.statusCard}
        </span>
      </div>

      {/* Панель управления статусом */}
      <div className="mt-1">
        <ProductUnitStatusPanel_v2 unit={unit} />
      </div>

      {/* Кнопка раскрытия логов */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-1 text-xs text-blue-600 hover:underline"
      >
        {expanded ? "Скрыть логи" : "Показать логи"}
      </button>

      {/* Логи */}
      {expanded && (
        <div className="mt-1">
          <LogsPanel_v2 unitId={unit.id} />
        </div>
      )}
    </div>
  );
}
