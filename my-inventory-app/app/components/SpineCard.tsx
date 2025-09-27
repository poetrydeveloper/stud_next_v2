// app/components/SpineCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductUnitCardStatus } from "@prisma/client";

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
      productCode?: string;
      productName?: string;
      productDescription?: string;
      statusCard: ProductUnitCardStatus;
      statusProduct?: string;
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
  onAddToCandidate?: (unitId: number) => Promise<void>;
}

export default function SpineCard({ spine, onAddToCandidate }: SpineCardProps) {
  const router = useRouter();
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [loadingUnits, setLoadingUnits] = useState<number[]>([]);

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
  const activeBrand = brands[activeBrandIndex];
  const activeBrandUnits = activeBrand ? activeBrand[1] : [];

  const handleCardClick = () => {
    router.push(`/spines/${spine.id}`);
  };

  const handleBrandClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveBrandIndex(index);
  };

  const handleAddToCandidate = async (unitId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onAddToCandidate) return;

    setLoadingUnits(prev => [...prev, unitId]);
    try {
      await onAddToCandidate(unitId);
    } finally {
      setLoadingUnits(prev => prev.filter(id => id !== unitId));
    }
  };

  // Сокращаем описание
  const shortenDescription = (description?: string) => {
    if (!description) return null;
    if (description.length <= 60) return description;
    return description.substring(0, 60) + '...';
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

      {/* Содержимое папки */}
      <div className="p-3">
        {/* Название Spine - маленькими буквами */}
        <div className="mb-3">
          <h3 className="text-xs text-gray-600 text-center mb-1">Spine</h3>
          <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
            <p className="text-sm text-gray-700 text-center font-medium" title={spine.name}>
              {spine.name}
            </p>
          </div>
        </div>

        {/* ProductUnits активного бренда */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {activeBrandUnits.map(unit => (
            <div key={unit.id} className="border border-gray-200 rounded-md p-2 bg-white">
              {/* Основная информация продукта */}
              <div className="mb-2">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {unit.productName || "Без названия"}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                    {unit.productCode}
                  </span>
                </div>
                
                {/* Описание (если есть) */}
                {unit.productDescription && (
                  <p className="text-xs text-gray-600 mb-1">
                    {shortenDescription(unit.productDescription)}
                  </p>
                )}
              </div>

              {/* Панель с кнопками и статусами */}
              <div className="flex justify-between items-center">
                {/* Статус кандидата */}
                <div className="flex items-center gap-1">
                  {unit.statusCard === ProductUnitCardStatus.CANDIDATE ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Кандидат
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleAddToCandidate(unit.id, e)}
                      disabled={loadingUnits.includes(unit.id)}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                    >
                      {loadingUnits.includes(unit.id) ? "..." : "+ Кандидат"}
                    </button>
                  )}
                </div>

                {/* Физический статус */}
                <span className={`text-xs px-1 rounded ${
                  unit.statusProduct === "IN_STORE" ? "bg-green-100 text-green-800" :
                  unit.statusProduct === "SOLD" ? "bg-blue-100 text-blue-800" :
                  unit.statusProduct === "CREDIT" ? "bg-purple-100 text-purple-800" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {unit.statusProduct || "Нет статуса"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Общая статистика */}
        <div className="flex justify-between items-center text-[10px] text-gray-600 mt-3 pt-2 border-t">
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

      {/* Нижняя полоса папки */}
      <div className="bg-gradient-to-b from-gray-200 to-gray-300 h-1 border-t border-gray-400"></div>
    </div>
  );
}