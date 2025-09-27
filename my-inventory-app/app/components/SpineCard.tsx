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
      quantityInCandidate?: number;
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
  onUnitStatusChange?: () => void; // Добавляем callback для обновления данных
}

export default function SpineCard({ spine, onUnitStatusChange }: SpineCardProps) {
  const router = useRouter();
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [loadingUnits, setLoadingUnits] = useState<number[]>([]);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

  // Группируем units по брендам (ВКЛЮЧАЯ кандидатов)
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

  const toggleExpanded = (unitId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleQuantityChange = (unitId: number, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [unitId]: Math.max(1, value)
    }));
  };

  const handleAddToCandidate = async (unitId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setLoadingUnits(prev => [...prev, unitId]);
    try {
      const response = await fetch('/api/product-units', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unitId: unitId,
          quantity: 1
        }),
      });

      if (response.ok) {
        // Вызываем callback для обновления данных родительским компонентом
        if (onUnitStatusChange) {
          onUnitStatusChange();
        }
      }
    } finally {
      setLoadingUnits(prev => prev.filter(id => id !== unitId));
    }
  };

  const handleCreateRequest = async (unitId: number, quantity: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setLoadingUnits(prev => [...prev, unitId]);
    try {
      const response = await fetch('/api/product-units/create-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unitId: unitId,
          quantity: quantity
        }),
      });

      if (response.ok) {
        setExpandedUnits(prev => prev.filter(id => id !== unitId));
        if (onUnitStatusChange) {
          onUnitStatusChange();
        }
      }
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

  const shortenBrandName = (name: string) => {
    if (name.length <= 6) return name;
    return name.substring(0, 6) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 hover:shadow-md transition-shadow duration-200 cursor-pointer w-80">
      {/* Верхняя часть с ярлычками */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 px-3 pt-1 pb-1 border-b border-gray-300 relative">
        <div className="flex justify-center gap-0.5 relative" style={{ height: '1.5rem' }}>
          {brands.map(([brandName, units], index) => {
            const isActive = index === activeBrandIndex;
            return (
              <button
                key={brandName}
                onClick={(e) => handleBrandClick(index, e)}
                className={`relative transition-all duration-200 ease-in-out
                  ${isActive ? 'z-20 -mt-1 bg-blue-500 text-white shadow-sm' : 'z-10 bg-gray-300 text-gray-600 hover:bg-gray-400'}
                  px-2 py-0.5 rounded-t-md text-[10px] font-medium border border-b-0 min-w-[38px] h-5 flex flex-col items-center justify-center`}
                title={`${brandName} (${units.length} ед.)`}
              >
                <div className={`font-semibold leading-none ${isActive ? 'text-white' : 'text-gray-800'}`}>
                  {shortenBrandName(brandName)}
                </div>
                <div className={`text-[8px] leading-none ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                  {units.length}
                </div>
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
        {/* Название Spine */}
        <div className="mb-3">
          <h3 className="text-xs text-gray-600 text-center mb-1">Spine</h3>
          <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
            <p className="text-sm text-gray-700 text-center font-medium">{spine.name}</p>
          </div>
        </div>

        {/* ProductUnits */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {activeBrandUnits.map(unit => (
            <div key={unit.id} className="border border-gray-200 rounded-md p-2 bg-white">
              {/* Основная информация */}
              <div className="mb-2">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {unit.productName || "Без названия"}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                    {unit.productCode}
                  </span>
                </div>
                {unit.productDescription && (
                  <p className="text-xs text-gray-600 mb-1">
                    {shortenDescription(unit.productDescription)}
                  </p>
                )}
              </div>

              {/* Панель управления */}
              {unit.statusCard === ProductUnitCardStatus.CANDIDATE ? (
                // Режим кандидата - создание заявки
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Кандидат
                    </span>
                    <button
                      onClick={(e) => toggleExpanded(unit.id, e)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {expandedUnits.includes(unit.id) ? "Свернуть" : "Заявка →"}
                    </button>
                  </div>

                  {expandedUnits.includes(unit.id) && (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min="1"
                        value={quantities[unit.id] || 1}
                        onChange={(e) => handleQuantityChange(unit.id, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-xs text-gray-600">шт.</span>
                      <button
                        onClick={(e) => handleCreateRequest(unit.id, quantities[unit.id] || 1, e)}
                        disabled={loadingUnits.includes(unit.id)}
                        className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 disabled:opacity-50"
                      >
                        {loadingUnits.includes(unit.id) ? "..." : "OK"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Обычный режим - добавление в кандидаты
                <div className="flex justify-between items-center">
                  <button
                    onClick={(e) => handleAddToCandidate(unit.id, e)}
                    disabled={loadingUnits.includes(unit.id)}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                  >
                    {loadingUnits.includes(unit.id) ? "..." : "+ Кандидат"}
                  </button>

                  <span className={`text-xs px-1 rounded ${
                    unit.statusProduct === "IN_STORE" ? "bg-green-100 text-green-800" :
                    unit.statusProduct === "SOLD" ? "bg-blue-100 text-blue-800" :
                    unit.statusProduct === "CREDIT" ? "bg-purple-100 text-purple-800" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {unit.statusProduct || "Нет статуса"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Статистика */}
        <div className="flex justify-between items-center text-[10px] text-gray-600 mt-3 pt-2 border-t">
          <span>Брендов: {brands.length}</span>
          <span>Всего: {spine._count.productUnits}</span>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-200 to-gray-300 h-1 border-t border-gray-400"></div>
    </div>
  );
}