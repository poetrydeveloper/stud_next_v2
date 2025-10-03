// app/product-units/UnitDetailClient.tsx
"use client";

import { ProductUnit } from "@/types/product-unit";
import ProductUnitActions from "@/app/components/ProductUnitActions";

interface UnitDetailClientProps {
  unit: ProductUnit;
}

export default function UnitDetailClient({ unit }: UnitDetailClientProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdate = (updatedUnit: ProductUnit) => {
    // Здесь можно добавить логику обновления состояния
    console.log("Unit updated:", updatedUnit);
    // В реальном приложении здесь может быть вызов SWR mutate или setState
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Информация о продукте */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Информация о продукте</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Название:</span>
            <span className="font-medium">{unit.productName || unit.product?.name || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Код:</span>
            <span className="font-mono bg-gray-50 px-2 py-1 rounded text-sm">
              {unit.product?.code || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Категория:</span>
            <span className="font-medium">{unit.product?.category?.name || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Spine:</span>
            <span className="font-medium">{unit.product?.spine?.name || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Описание:</span>
            <span className="font-medium text-right max-w-xs">{unit.product?.description || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Цена заявки:</span>
            <span className="font-medium">{unit.purchasePrice ? `${unit.purchasePrice} ₽` : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Статус карточки:</span>
            <span className="font-medium capitalize">{unit.statusCard?.toLowerCase() || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Физический статус:</span>
            <span className="font-medium capitalize">{unit.statusProduct?.toLowerCase() || "—"}</span>
          </div>
          {unit.isReturned && (
            <div className="flex justify-between text-red-600">
              <span>Возврат оформлен:</span>
              <span className="font-medium">{formatDate(unit.returnedAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Продажи и действия */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Продажи и действия</h2>
          
          {unit.statusProduct === "SOLD" && !unit.isCredit && (
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Покупатель:</span>
                <span className="font-medium">{unit.buyerName} {unit.buyerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Цена продажи:</span>
                <span className="font-medium text-green-600">{unit.salePrice} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Дата продажи:</span>
                <span className="font-medium">{formatDate(unit.soldAt)}</span>
              </div>
            </div>
          )}

          {unit.isCredit && (
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Продано в кредит:</span>
                <span className="font-medium">{unit.buyerName} {unit.buyerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Дата продажи:</span>
                <span className="font-medium">{formatDate(unit.soldAt)}</span>
              </div>
              {unit.creditPaidAt && (
                <div className="flex justify-between text-green-600">
                  <span>Долг погашен:</span>
                  <span className="font-medium">{formatDate(unit.creditPaidAt)}</span>
                </div>
              )}
            </div>
          )}

          <ProductUnitActions unit={unit} onUpdate={handleUpdate} />
        </div>

        {/* Дополнительная информация */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Дополнительная информация</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Серийный номер:</span>
              <span className="font-mono bg-gray-50 px-2 py-1 rounded">{unit.serialNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Создан:</span>
              <span className="font-medium">{formatDate(unit.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Обновлен:</span>
              <span className="font-medium">{formatDate(unit.updatedAt)}</span>
            </div>
            {unit.notes && (
              <div>
                <span className="text-gray-600 block mb-2">Примечания:</span>
                <p className="text-gray-800 bg-gray-50 p-3 rounded border">{unit.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}