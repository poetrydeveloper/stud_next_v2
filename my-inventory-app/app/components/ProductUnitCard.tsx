// app/components/ProductUnitCard.tsx
"use client";

import Link from "next/link";

interface ProductUnitCardProps {
  unit: {
    id: number;
    serialNumber: string;
    productName?: string;
    statusCard?: string;
    statusProduct?: string;
    salePrice?: number;
    purchasePrice?: number;
    isReturned?: boolean;
    returnedAt?: string;
    soldAt?: string;
    product?: {
      name: string;
      code: string;
      images?: Array<{
        id: number;
        path: string;
        isMain: boolean;
      }>;
      spine?: { name: string };
      category?: { name: string };
    };
    spine?: { name: string };
  };
}

export default function ProductUnitCard({ unit }: ProductUnitCardProps) {
  // Получаем основное изображение
  const mainImage = unit.product?.images?.find(img => img.isMain) || unit.product?.images?.[0];
  
  // Форматируем дату
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Цвета статусов продукта
  const getProductStatusConfig = (status: string) => {
    const statusConfig = {
      IN_STORE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'На складе' },
      SOLD: { bg: 'bg-green-100', text: 'text-green-800', label: 'Продано' },
      CREDIT: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'В кредите' },
      LOST: { bg: 'bg-red-100', text: 'text-red-800', label: 'Утеряно' }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      label: 'Не определен' 
    };
  };

  // Цвета статусов карточки
  const getCardStatusConfig = (status: string) => {
    const statusConfig = {
      CLEAR: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'CLEAR' },
      CANDIDATE: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'CANDIDATE' },
      SPROUTED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'SPROUTED' },
      IN_REQUEST: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'IN_REQUEST' },
      IN_DELIVERY: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'IN_DELIVERY' },
      ARRIVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'ARRIVED' }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800', 
      label: status || 'Не указан' 
    };
  };

  // ИСПРАВЛЕНО: используем IN_STORE по умолчанию вместо пустой строки
  const productStatusConfig = getProductStatusConfig(unit.statusProduct || 'IN_STORE');
  const cardStatusConfig = getCardStatusConfig(unit.statusCard || 'CLEAR');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
      {/* Изображение товара - фиксированная высота */}
      <div className="relative h-48 bg-gray-100">
        {mainImage ? (
          <img
            src={mainImage.path}
            alt={unit.productName || unit.product?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Нет изображения</span>
            </div>
          </div>
        )}
      </div>

      {/* Контент карточки */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Заголовок и статусы */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {unit.productName || unit.product?.name || "Без названия"}
          </h3>
          
          {/* Статусы в ряд */}
          <div className="flex flex-wrap gap-1 mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${productStatusConfig.bg} ${productStatusConfig.text}`}>
              {productStatusConfig.label}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${cardStatusConfig.bg} ${cardStatusConfig.text}`}>
              {cardStatusConfig.label}
            </span>
          </div>
        </div>

        {/* Серийный номер */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Серийный номер</div>
          <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border text-gray-800">
            {unit.serialNumber}
          </p>
        </div>

        {/* Информация о товаре */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Spine</div>
            <div className="text-sm font-medium text-gray-800 truncate">
              {unit.product?.spine?.name || unit.spine?.name || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Категория</div>
            <div className="text-sm font-medium text-gray-800 truncate">
              {unit.product?.category?.name || "—"}
            </div>
          </div>
        </div>

        {/* Цены */}
        <div className="mb-3 space-y-1">
          {unit.purchasePrice && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Закупка:</span>
              <span className="font-medium text-gray-800">{unit.purchasePrice.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
          {unit.salePrice && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Продажа:</span>
              <span className="font-medium text-green-600">{unit.salePrice.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
        </div>

        {/* Дополнительная информация */}
        <div className="mt-auto space-y-1 text-xs text-gray-600">
          {unit.soldAt && (
            <div className="flex justify-between">
              <span>Продано:</span>
              <span className="font-medium">{formatDate(unit.soldAt)}</span>
            </div>
          )}
          
          {unit.isReturned && (
            <div className="flex justify-between text-red-600">
              <span>Возврат:</span>
              <span className="font-medium">{formatDate(unit.returnedAt)}</span>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
          <Link
            href={`/product-units/${unit.id}`}
            className="inline-flex items-center text-blue-600 text-sm hover:text-blue-800 font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Подробнее
          </Link>
          <Link
            href={`/product-units/${unit.id}/edit`}
            className="inline-flex items-center text-gray-600 text-sm hover:text-gray-800 font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Редакт.
          </Link>
        </div>
      </div>
    </div>
  );
}