// app/components/ProductUnitCard.tsx
"use client";

import Link from "next/link";

interface ProductUnitCardProps {
  unit: {
    id: number;
    serialNumber: string;
    productName?: string;
    product?: {
      name: string;
      code: string;
      images?: Array<{
        id: number;
        path: string;
        isMain: boolean;
      }>;
      spine?: {
        name: string;
      };
      category?: {
        name: string;
      };
    };
    salePrice?: number;
    statusProduct?: string;
    isReturned?: boolean;
    returnedAt?: string;
    soldAt?: string;
    spine?: {
      name: string;
    };
  };
}

/**
 * Карточка единицы товара для отображения в сетке.
 * Показывает название, серийный номер, цену и статус, а также возврат и дату продажи.
 */
export default function ProductUnitCard({ unit }: ProductUnitCardProps) {
  // Получаем основное изображение
  const mainImage = unit.product?.images?.find(img => img.isMain) || unit.product?.images?.[0];
  
  // Форматируем дату
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Цвета статусов
  const getStatusConfig = (status: string) => {
    const statusConfig = {
      IN_STORE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'На складе' },
      SOLD: { bg: 'bg-green-100', text: 'text-green-800', label: 'Продано' },
      CREDIT: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'В кредите' },
      LOST: { bg: 'bg-red-100', text: 'text-red-800', label: 'Утеряно' }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      label: status || 'Не указан' 
    };
  };

  const statusConfig = getStatusConfig(unit.statusProduct || '');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Изображение товара */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {mainImage ? (
          <img
            src={mainImage.path}
            alt={unit.productName || unit.product?.name}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">Нет изображения</span>
            </div>
          </div>
        )}
      </div>

      {/* Контент карточки */}
      <div className="p-4">
        {/* Заголовок */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {unit.productName || unit.product?.name || "Без названия"}
        </h3>

        {/* Серийный номер */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Серийный номер
          </div>
          <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border">
            {unit.serialNumber}
          </p>
        </div>

        {/* Информация о товаре */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Spine</div>
            <div className="text-sm font-medium text-gray-800">
              {unit.product?.spine?.name || unit.spine?.name || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Категория</div>
            <div className="text-sm font-medium text-gray-800">
              {unit.product?.category?.name || "—"}
            </div>
          </div>
        </div>

        {/* Цена */}
        {unit.salePrice && (
          <div className="mb-3 p-2 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 mb-1">Цена продажи</div>
            <div className="text-lg font-bold text-blue-900">
              {unit.salePrice.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        )}

        {/* Статус */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Дополнительная информация */}
        <div className="space-y-2 text-xs text-gray-600">
          {unit.soldAt && (
            <div className="flex justify-between">
              <span>Продано:</span>
              <span className="font-medium">{formatDate(unit.soldAt)}</span>
            </div>
          )}
          
          {unit.isReturned && (
            <div className="flex justify-between text-red-600">
              <span>Возврат:</span>
              <span className="font-medium">{formatDate(unit.returnedAt || '')}</span>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
          <Link
            href={`/product-units/${unit.id}`}
            className="inline-flex items-center text-blue-600 text-sm hover:text-blue-800 font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Подробнее
          </Link>
          <Link
            href={`/product-units/${unit.id}/edit`}
            className="inline-flex items-center text-yellow-600 text-sm hover:text-yellow-800 font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Редактировать
          </Link>
        </div>
      </div>
    </div>
  );
}