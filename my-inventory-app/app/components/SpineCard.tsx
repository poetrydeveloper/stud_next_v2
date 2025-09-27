// app/components/SpineCard.tsx
"use client";

import { useRouter } from "next/navigation";

interface SpineCardProps {
  spine: {
    id: number;
    name: string;
    slug: string;
    imagePath?: string;
    category?: {
      name: string;
    };
    productUnits: Array<{
      id: number;
      serialNumber: string;
      statusCard: string;
      statusProduct: string;
      salePrice?: number;
      requestPricePerUnit?: number;
      product: {
        brand?: {
          name: string;
        };
      };
    }>;
    _count: {
      productUnits: number;
    };
  };
}

export default function SpineCard({ spine }: SpineCardProps) {
  const router = useRouter();

  // Статистика по units
  const stats = {
    // Физические статусы
    inStore: spine.productUnits.filter(unit => unit.statusProduct === "IN_STORE").length,
    sold: spine.productUnits.filter(unit => unit.statusProduct === "SOLD").length,
    credit: spine.productUnits.filter(unit => unit.statusProduct === "CREDIT").length,
    lost: spine.productUnits.filter(unit => unit.statusProduct === "LOST").length,
    
    // Карточные статусы (заказы/кандидаты)
    candidate: spine.productUnits.filter(unit => unit.statusCard === "CANDIDATE").length,
    inRequest: spine.productUnits.filter(unit => unit.statusCard === "IN_REQUEST").length,
    inDelivery: spine.productUnits.filter(unit => unit.statusCard === "IN_DELIVERY").length,
  };

  // Уникальные бренды в этом spine
  const uniqueBrands = Array.from(new Set(
    spine.productUnits
      .map(unit => unit.product.brand?.name)
      .filter(Boolean)
  )).slice(0, 3); // максимум 3 бренда

  // Средняя/минимальная цена
  const prices = spine.productUnits
    .filter(unit => unit.salePrice || unit.requestPricePerUnit)
    .map(unit => unit.salePrice || unit.requestPricePerUnit)
    .filter((price): price is number => !!price);
  
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  const handleCardClick = () => {
    router.push(`/spines/${spine.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Верхняя часть - обложка */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Картинка Spine */}
          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
            {spine.imagePath ? (
              <img
                src={spine.imagePath}
                alt={spine.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Основная информация */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{spine.name}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {spine.category?.name || "Без категории"}
            </p>
            
            {/* Бренды */}
            {uniqueBrands.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {uniqueBrands.map(brand => (
                  <span key={brand} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {brand}
                  </span>
                ))}
                {spine._count.productUnits > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    +{spine._count.productUnits - 3} ед.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Нижняя часть - статистика units */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Левая колонка - основные цифры */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Всего:</span>
              <span className="font-semibold">{spine._count.productUnits} ед.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">В наличии:</span>
              <span className="font-semibold text-green-600">{stats.inStore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Продано:</span>
              <span className="font-semibold text-blue-600">{stats.sold}</span>
            </div>
          </div>

          {/* Правая колонка - заказы и цены */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">В заказах:</span>
              <span className="font-semibold text-orange-600">
                {stats.candidate + stats.inRequest + stats.inDelivery}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Кредит:</span>
              <span className="font-semibold text-purple-600">{stats.credit}</span>
            </div>
            {minPrice && (
              <div className="flex justify-between">
                <span className="text-gray-600">Цена:</span>
                <span className="font-semibold text-green-600">
                  {minPrice === maxPrice ? `${minPrice}₽` : `${minPrice}₽-${maxPrice}₽`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Индикаторы статусов */}
        <div className="flex gap-1 mt-2">
          {stats.inStore > 0 && (
            <div className="h-1 flex-1 bg-green-400 rounded" title="В наличии"></div>
          )}
          {stats.sold > 0 && (
            <div className="h-1 flex-1 bg-blue-400 rounded" title="Продано"></div>
          )}
          {(stats.candidate + stats.inRequest + stats.inDelivery) > 0 && (
            <div className="h-1 flex-1 bg-orange-400 rounded" title="В заказах"></div>
          )}
          {stats.credit > 0 && (
            <div className="h-1 flex-1 bg-purple-400 rounded" title="В кредите"></div>
          )}
          {stats.lost > 0 && (
            <div className="h-1 flex-1 bg-red-400 rounded" title="Потеряно"></div>
          )}
        </div>
      </div>
    </div>
  );
}