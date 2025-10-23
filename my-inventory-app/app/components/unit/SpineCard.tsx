// app/product-units/components/unit/SpineCard.tsx
"use client";

import { useState } from "react";
import UnitMiniCard from "./UnitMiniCard";

interface Spine {
  id: number;
  name: string;
}

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
    }>;
  };
  logs?: Array<{
    id: number;
    type: string;
    message: string;
    createdAt: string;
  }>;
}

interface SpineCardProps {
  spine: Spine;
  units: ProductUnit[];
}

export default function SpineCard({ spine, units }: SpineCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeBrand, setActiveBrand] = useState<string>("all");

  // Группируем units по брендам
  const brandsMap = new Map();
  units.forEach(unit => {
    const brandName = unit.product?.brand?.name || "Без бренда";
    if (!brandsMap.has(brandName)) {
      brandsMap.set(brandName, []);
    }
    brandsMap.get(brandName).push(unit);
  });

  const brands = Array.from(brandsMap.entries());
  const filteredUnits = activeBrand === "all" 
    ? units 
    : brandsMap.get(activeBrand) || [];

  // Статистика по статусам для этого Spine
  const statusStats = {
    CLEAR: units.filter(u => u.statusCard === "CLEAR").length,
    CANDIDATE: units.filter(u => u.statusCard === "CANDIDATE").length,
    IN_REQUEST: units.filter(u => u.statusCard === "IN_REQUEST").length,
    IN_STORE: units.filter(u => u.statusProduct === "IN_STORE").length,
    SOLD: units.filter(u => u.statusProduct === "SOLD").length,
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      {/* Шапка Spine */}
      <div 
        className="flex items-center justify-between p-3 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
            ▶
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{spine.name}</h4>
            <p className="text-sm text-gray-600">
              {units.length} единиц • {brands.length} брендов
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Мини-статистика статусов */}
          <div className="flex space-x-1">
            {statusStats.CLEAR > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                {statusStats.CLEAR}🟢
              </span>
            )}
            {statusStats.CANDIDATE > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                {statusStats.CANDIDATE}🟡
              </span>
            )}
            {statusStats.IN_REQUEST > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-indigo-100 text-indigo-800">
                {statusStats.IN_REQUEST}🔵
              </span>
            )}
            {statusStats.IN_STORE > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-800">
                {statusStats.IN_STORE}📦
              </span>
            )}
            {statusStats.SOLD > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-purple-100 text-purple-800">
                {statusStats.SOLD}💰
              </span>
            )}
          </div>

          <span className="text-sm text-gray-500">
            {isExpanded ? 'Скрыть' : 'Показать'}
          </span>
        </div>
      </div>

      {/* Содержимое Spine */}
      {isExpanded && (
        <div className="p-3">
          {/* Вкладки брендов */}
          {brands.length > 1 && (
            <div className="flex gap-1 overflow-x-auto mb-3">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveBrand("all"); }}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeBrand === "all" 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <span>Все бренды</span>
                <span className={`px-1.5 py-0.5 rounded text-xs ${
                  activeBrand === "all" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {units.length}
                </span>
              </button>

              {brands.map(([brandName, brandUnits]) => (
                <button
                  key={brandName}
                  onClick={(e) => { e.stopPropagation(); setActiveBrand(brandName); }}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeBrand === brandName 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <span>{brandName}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    activeBrand === brandName ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {brandUnits.length}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Сетка UnitMiniCard */}
          {filteredUnits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredUnits.map(unit => (
                <UnitMiniCard 
                  key={unit.id} 
                  unit={unit} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <div className="text-3xl mb-2">📭</div>
              <p>Нет товаров в выбранном бренде</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}