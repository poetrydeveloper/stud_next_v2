// app/product-units/UnitDetailClient.tsx
"use client";

import { ProductUnit } from "@/types/product-unit";
import ProductUnitActions from "@/app/components/ProductUnitActions";

interface UnitDetailClientProps {
  unit: ProductUnit & {
    product?: {
      category?: { name: string };
      spine?: { name: string };
      brand?: { name: string };
      images?: Array<{ id: number; path: string; isMain: boolean }>;
    };
  };
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
    console.log("Unit updated:", updatedUnit);
    // В реальном приложении здесь может быть вызов SWR mutate или setState
  };

  // Получаем основное изображение
  const mainImage = unit.product?.images?.find(img => img.isMain) || unit.product?.images?.[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Левая колонка - Основная информация */}
      <div className="lg:col-span-2 space-y-6">
        {/* Карточка продукта */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Информация о продукте</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600 block mb-1">Название:</span>
              <p className="font-medium">{unit.productName || unit.product?.name || "—"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 block mb-1">Код:</span>
              <p className="font-mono bg-gray-50 px-2 py-1 rounded text-sm">
                {unit.product?.code || "—"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 block mb-1">Категория:</span>
              <p className="font-medium">{unit.product?.category?.name || "—"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 block mb-1">Spine:</span>
              <p className="font-medium">{unit.product?.spine?.name || unit.spine?.name || "—"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 block mb-1">Бренд:</span>
              <p className="font-medium">{unit.product?.brand?.name || "—"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 block mb-1">Цена заявки:</span>
              <p className="font-medium">{unit.purchasePrice ? `${unit.purchasePrice} ₽` : "—"}</p>
            </div>
          </div>
          
          {unit.product?.description && (
            <div className="mt-4">
              <span className="text-sm text-gray-600 block mb-1">Описание:</span>
              <p className="text-gray-800">{unit.product.description}</p>
            </div>
          )}
        </div>

        {/* Продажи и действия */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Продажи и действия</h2>
          
          {unit.statusProduct === "SOLD" && !unit.isCredit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600 block mb-1">Покупатель:</span>
                <p className="font-medium">{unit.buyerName} {unit.buyerPhone}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600 block mb-1">Цена продажи:</span>
                <p className="font-medium text-green-600">{unit.salePrice} ₽</p>
              </div>
              <div>
                <span className="text-sm text-gray-600 block mb-1">Дата продажи:</span>
                <p className="font-medium">{formatDate(unit.soldAt)}</p>
              </div>
            </div>
          )}

          {unit.isCredit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600 block mb-1">Продано в кредит:</span>
                <p className="font-medium">{unit.buyerName} {unit.buyerPhone}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600 block mb-1">Дата продажи:</span>
                <p className="font-medium">{formatDate(unit.soldAt)}</p>
              </div>
              {unit.creditPaidAt && (
                <div className="md:col-span-2">
                  <span className="text-sm text-green-600 block mb-1">Долг погашен:</span>
                  <p className="font-medium">{formatDate(unit.creditPaidAt)}</p>
                </div>
              )}
            </div>
          )}

          <ProductUnitActions unit={unit} onUpdate={handleUpdate} />
        </div>
      </div>

      {/* Правая колонка - Дополнительная информация */}
      <div className="space-y-6">
        {/* Изображение */}
        {mainImage && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Изображение</h3>
            <img
              src={mainImage.path}
              alt={unit.productName || unit.product?.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Статусы и мета-информация */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Статусы</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Статус карточки:</span>
              <span className="font-medium capitalize">{unit.statusCard?.toLowerCase() || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Физический статус:</span>
              <span className="font-medium capitalize">{unit.statusProduct?.toLowerCase() || "—"}</span>
            </div>
            {unit.isReturned && (
              <div className="flex justify-between text-red-600">
                <span className="text-sm">Возврат оформлен:</span>
                <span className="font-medium">{formatDate(unit.returnedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Дополнительно</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Создан:</span>
              <span className="font-medium">{formatDate(unit.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Обновлен:</span>
              <span className="font-medium">{formatDate(unit.updatedAt)}</span>
            </div>
            {unit.notes && (
              <div>
                <span className="text-sm text-gray-600 block mb-2">Примечания:</span>
                <p className="text-gray-800 bg-gray-50 p-3 rounded border text-sm">{unit.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}