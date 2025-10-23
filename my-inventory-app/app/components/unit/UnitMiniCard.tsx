// app/product-units/components/unit/UnitMiniCard.tsx
"use client";

import { useState } from "react";
import CreateRequestModal from "./CreateRequestModal";

interface ProductUnit {
  id: number;
  serialNumber: string;
  statusCard: string;
  statusProduct?: string;
  productName?: string;
  productCode?: string;
  product?: {
    name: string;
    code: string;
    brand?: {
      name: string;
    };
    images?: Array<{
      path: string;
      isMain: boolean;
      localPath?: string;
    }>;
  };
}

interface UnitMiniCardProps {
  unit: ProductUnit;
}

export default function UnitMiniCard({ unit }: UnitMiniCardProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const mainImage = unit.product?.images?.find(img => img.isMain) || unit.product?.images?.[0];
  const imagePath = mainImage?.localPath || mainImage?.path;
  const productName = unit.productName || unit.product?.name || "Без названия";
  const productCode = unit.productCode || unit.product?.code || "—";
  const brandName = unit.product?.brand?.name;

  const getStatusConfig = (status: string, type: 'card' | 'product') => {
    const configs = {
      card: {
        CLEAR: { bg: 'bg-green-100', text: 'text-green-800', label: 'CLEAR', icon: '🟢' },
        CANDIDATE: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'CANDIDATE', icon: '🟡' },
        IN_REQUEST: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'IN_REQUEST', icon: '🔵' },
        SPROUTED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'SPROUTED', icon: '🟣' },
      },
      product: {
        IN_STORE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'IN_STORE', icon: '📦' },
        SOLD: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'SOLD', icon: '💰' },
        CREDIT: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'CREDIT', icon: '💳' },
        LOST: { bg: 'bg-red-100', text: 'text-red-800', label: 'LOST', icon: '❌' },
      }
    };

    return configs[type][status as keyof typeof configs[type]] || 
           { bg: 'bg-gray-100', text: 'text-gray-800', label: status, icon: '❓' };
  };

  const cardConfig = getStatusConfig(unit.statusCard, 'card');
  const productConfig = unit.statusProduct ? getStatusConfig(unit.statusProduct, 'product') : null;

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
        {/* Верхняя часть - основная информация */}
        <div className="flex items-start space-x-3 mb-2">
          {/* Изображение */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded border overflow-hidden">
              {imagePath ? (
                <img
                  src={imagePath}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                  📦
                </div>
              )}
            </div>
          </div>

          {/* Информация */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h5 className="font-medium text-gray-900 text-sm truncate" title={productName}>
                {productName}
              </h5>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 ml-1"
              >
                {isExpanded ? '▲' : '▼'}
              </button>
            </div>
            
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                {unit.serialNumber}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${cardConfig.bg} ${cardConfig.text}`}>
                {cardConfig.icon}
              </span>
              {productConfig && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${productConfig.bg} ${productConfig.text}`}>
                  {productConfig.icon}
                </span>
              )}
            </div>

            {brandName && (
              <div className="text-xs text-gray-600">
                🏷️ {brandName}
              </div>
            )}
          </div>
        </div>

        {/* Раскрывающаяся часть */}
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
            <div className="text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Артикул:</span>
                <span className="font-mono">{productCode}</span>
              </div>
            </div>

            {/* Действия в зависимости от статуса */}
            <div className="flex gap-1">
              {unit.statusCard === "CLEAR" && (
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded transition-colors"
                >
                  В кандидаты
                </button>
              )}
              
              {unit.statusCard === "CANDIDATE" && (
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors"
                >
                  В заявку
                </button>
              )}

              <button
                onClick={() => {/* TODO: Переход на детальную страницу */}}
                className="bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded transition-colors"
              >
                Подробнее
              </button>
            </div>
          </div>
        )}

        {/* Компактные действия (без раскрытия) */}
        {!isExpanded && (
          <div className="flex gap-1 mt-2">
            {unit.statusCard === "CLEAR" && (
              <button
                onClick={() => setShowRequestModal(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded transition-colors"
              >
                Кандидат
              </button>
            )}
            
            {unit.statusCard === "CANDIDATE" && (
              <button
                onClick={() => setShowRequestModal(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors"
              >
                Заявка
              </button>
            )}
          </div>
        )}
      </div>

      {/* Модальное окно создания заявки */}
      {showRequestModal && (
        <CreateRequestModal
          unit={unit}
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}