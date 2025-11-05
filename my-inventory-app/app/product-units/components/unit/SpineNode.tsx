// app/product-units/components/unit/SpineNode.tsx
"use client";

import { useState, useEffect } from "react";
import UnitMiniCard from "./UnitMiniCard";
import StatusStats from "./StatusStats";

interface SpineNodeProps {
  spine: any;
  level: number;
  onUnitStatusChange?: (unitId: number, newStatus: string) => void;
}

export default function SpineNode({ spine, level, onUnitStatusChange }: SpineNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeBrand, setActiveBrand] = useState("all");
  const [currentSpine, setCurrentSpine] = useState(spine);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Функция для обновления данных этого spine
  const refreshSpineData = async () => {
  try {
    setIsRefreshing(true);
    // ❌ МЕНЯЕМ endpoint - используем существующий API для spine данных
    const response = await fetch(`/api/product-units/page-data?cache=${Date.now()}`);
    const data = await response.json();
    
    if (data.ok && data.categories) {
      // Находим актуальный spine в обновленных данных
      const allSpines = data.categories.flatMap((cat: any) => cat.spines || []);
      const updatedSpine = allSpines.find((s: any) => s.id === spine.id);
      
      if (updatedSpine) {
        setCurrentSpine(updatedSpine);
        console.log("Spine data updated locally:", updatedSpine.productUnits?.length, "units");
      }
    }
  } catch (error) {
    console.error("Error refreshing spine:", error);
  } finally {
    setIsRefreshing(false);
  }
};

  // Обновляем данные при изменении props
  useEffect(() => {
    setCurrentSpine(spine);
  }, [spine]);

  const brandsMap = new Map();
  currentSpine.productUnits?.forEach((unit: any) => {
    const brandName = unit.product?.brand?.name || "Без бренда";
    if (!brandsMap.has(brandName)) brandsMap.set(brandName, []);
    brandsMap.get(brandName).push(unit);
  });

  const brands = Array.from(brandsMap.entries());
  const filteredUnits = activeBrand === "all" 
    ? currentSpine.productUnits || []
    : brandsMap.get(activeBrand) || [];

  // Функция для передачи в UnitMiniCard
  const handleUnitStatusChange = (unitId: number, newStatus: string) => {
    onUnitStatusChange?.(unitId, newStatus);
  };

  // Функция для обновления при создании заявки - ТОЛЬКО ЛОКАЛЬНОЕ ОБНОВЛЕНИЕ
  const handleSpineRefresh = () => {
    refreshSpineData();
    // НЕ вызываем onSpineRefresh - обновляем только локально
  };

  return (
    <div className={`${level > 0 ? 'ml-6 border-l-2 border-orange-200 pl-4' : ''}`}>
      <div className="bg-orange-50 rounded-lg border border-orange-200">
        <div 
          className="flex items-center justify-between p-3 bg-white border-b border-orange-200 cursor-pointer hover:bg-orange-50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                S
              </div>
              {isRefreshing && (
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-orange-900">{currentSpine.name}</h4>
              <p className="text-sm text-orange-700">
                {currentSpine.productUnits?.length || 0} единиц • {brands.length} брендов
                {isRefreshing && " (обновление...)"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <StatusStats spines={[currentSpine]} compact />
            <div className="flex items-center space-x-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  refreshSpineData();
                }}
                className="text-orange-500 hover:text-orange-700 transition-colors p-1"
                title="Обновить данные spine"
                disabled={isRefreshing}
              >
                🔄
              </button>
              <span className="text-sm text-orange-600">
                {isExpanded ? '▲' : '▼'}
              </span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-3">
            {brands.length > 1 && (
              <BrandTabs 
                brands={brands}
                activeBrand={activeBrand}
                onBrandChange={setActiveBrand}
                totalUnits={currentSpine.productUnits?.length || 0}
              />
            )}
            
            {filteredUnits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredUnits.map((unit: any) => (
                  <UnitMiniCard 
                    key={unit.id} 
                    unit={unit} 
                    onStatusChange={handleUnitStatusChange}
                    onSpineRefresh={handleSpineRefresh} // ← ПЕРЕДАЕМ ФУНКЦИЮ ЛОКАЛЬНОГО ОБНОВЛЕНИЯ
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-orange-500">
                <div className="text-3xl mb-2">📭</div>
                <p>Нет товаров</p>
                <button 
                  onClick={refreshSpineData}
                  className="mt-2 text-sm text-orange-600 hover:text-orange-800 underline"
                  disabled={isRefreshing}
                >
                  {isRefreshing ? "Обновление..." : "Обновить"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
