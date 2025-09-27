// app/components/SpineCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);

  // Группируем units по брендам
  const brandsMap = new Map();
  spine.productUnits.forEach(unit => {
    const brandName = unit.product.brand?.name || "Без бренда";
    if (!brandsMap.has(brandName)) {
      brandsMap.set(brandName, []);
    }
    brandsMap.get(brandName).push(unit);
  });

  const brands = Array.from(brandsMap.entries());

  const handleCardClick = () => {
    router.push(`/spines/${spine.id}`);
  };

  const handleBrandClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveBrandIndex(index);
  };

  // Сокращаем название бренда
  const shortenBrandName = (name: string) => {
    if (name.length <= 6) return name;
    return name.substring(0, 6) + '...';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-300 hover:shadow-md transition-shadow duration-200 cursor-pointer w-80"
      onClick={handleCardClick}
    >
      {/* Компактная верхняя часть с ярлычками */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 px-3 pt-1 pb-1 border-b border-gray-300 relative">
        <div className="flex justify-center gap-0.5 relative" style={{ height: '1.5rem' }}>
          {brands.map(([brandName, units], index) => {
            const isActive = index === activeBrandIndex;
            
            return (
              <button
                key={brandName}
                onClick={(e) => handleBrandClick(index, e)}
                className={`
                  relative transition-all duration-200 ease-in-out
                  ${isActive 
                    ? 'z-20 -mt-1 bg-blue-500 text-white shadow-sm'
                    : 'z-10 bg-gray-300 text-gray-600 hover:bg-gray-400'
                  }
                  px-2 py-0.5 rounded-t-md text-[10px] font-medium border border-b-0 min-w-[38px] h-5
                  flex flex-col items-center justify-center
                `}
                title={`${brandName} (${units.length} ед.)`}
              >
                <div className={`font-semibold leading-none ${isActive ? 'text-white' : 'text-gray-800'}`}>
                  {shortenBrandName(brandName)}
                </div>
                <div className={`text-[8px] leading-none ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                  {units.length}
                </div>
                
                {/* Маленький индикатор */}
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-blue-500"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Содержимое папки - горизонтальное расположение */}
      <div className="flex p-3">
        {/* Левая часть - текст */}
        <div className="flex-1 min-w-0 pr-3">
          {/* Название Spine в рамке */}
          <div className="border border-gray-200 rounded-md p-3 mb-3 bg-gray-50"> {/* Увеличил padding */}
            <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight" title={spine.name}>
              {spine.name}
            </h3>
          </div>

          {/* Общая статистика - более компактная */}
          <div className="flex justify-center gap-4 items-center text-[10px] text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              <span>Брендов: {brands.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <span>Всего: {spine._count.productUnits}</span>
            </div>
          </div>
        </div>

        {/* Правая часть - изображение */}
        <div className="flex-shrink-0 w-24 h-24">
          {spine.imagePath && spine.imagePath !== "/images/spine-placeholder.png" ? (
            <img
              src={spine.imagePath}
              alt={spine.name}
              className="w-full h-full object-contain bg-gray-50 rounded border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
          ) : null}
          
          {/* Fallback для изображений */}
          <div className={`w-full h-full flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-300 ${
            spine.imagePath && spine.imagePath !== "/images/spine-placeholder.png" ? 'hidden' : ''
          }`}>
            <div className="text-center text-gray-400">
              <svg className="w-6 h-6 mx-auto mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span className="text-[8px]">Нет изображения</span>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя полоса папки */}
      <div className="bg-gradient-to-b from-gray-200 to-gray-300 h-1 border-t border-gray-400"></div>
    </div>
  );
}