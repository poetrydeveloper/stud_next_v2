// app/components/ProductUnitCard.tsx

"use client";

import Link from "next/link";

/**
 * Карточка единицы товара для отображения в сетке.
 * Показывает название, серийный номер, цену и статус, а также возврат и дату продажи.
 */
export default function ProductUnitCard({ unit }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex flex-col justify-between">
      <div>
        {/* Название товара */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {unit.productName || unit.product?.name || "Без названия"}
        </h3>

        {/* Серийный номер */}
        <p className="text-sm text-gray-500 mb-2">
          Серийный №: <span className="font-medium">{unit.serialNumber}</span>
        </p>

        {/* Цена продажи */}
        <p className="text-sm text-gray-500 mb-2">
          Цена:{" "}
          <span className="font-medium">
            {unit.salePrice ? `${unit.salePrice} ₽` : "-"}
          </span>
        </p>

        {/* Статусы */}
        <div className="mt-2 flex flex-col gap-1">
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded 
              ${
                unit.statusProduct === "SOLD"
                  ? "bg-green-100 text-green-800"
                  : unit.statusProduct === "LOST"
                  ? "bg-red-100 text-red-800"
                  : unit.statusProduct === "IN_STORE"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
          >
            {unit.statusProduct || "Не указан"}
          </span>

          {unit.isReturned && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
              Возврат: {unit.returnedAt ? new Date(unit.returnedAt).toLocaleString() : "-"}
            </span>
          )}

          {unit.soldAt && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
              Продано: {new Date(unit.soldAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="mt-4 flex justify-between">
        <Link
          href={`/product-units/${unit.id}`}
          className="text-blue-600 text-sm hover:underline"
        >
          Подробнее
        </Link>
        <Link
          href={`/product-units/${unit.id}/edit`}
          className="text-yellow-600 text-sm hover:underline"
        >
          Редактировать
        </Link>
      </div>
    </div>
  );
}
