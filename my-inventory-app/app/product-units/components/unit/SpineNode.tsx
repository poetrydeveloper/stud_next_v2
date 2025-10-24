// app/product-units/components/unit/SpineNode.tsx
"use client";

import { useState } from "react";
import UnitMiniCard from "./UnitMiniCard";
import StatusStats from "./StatusStats";

interface SpineNodeProps {
  spine: any;
  level: number;
}

export default function SpineNode({ spine, level }: SpineNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeBrand, setActiveBrand] = useState("all");

  const brandsMap = new Map();
  spine.productUnits?.forEach((unit: any) => {
    const brandName = unit.product?.brand?.name || "Без бренда";
    if (!brandsMap.has(brandName)) brandsMap.set(brandName, []);
    brandsMap.get(brandName).push(unit);
  });

  const brands = Array.from(brandsMap.entries());
  const filteredUnits = activeBrand === "all" 
    ? spine.productUnits || []
    : brandsMap.get(activeBrand) || [];

  return (
    <div className={`${level > 0 ? 'ml-6 border-l-2 border-orange-200 pl-4' : ''}`}>
      <div className="bg-orange-50 rounded-lg border border-orange-200">
        <div 
          className="flex items-center justify-between p-3 bg-white border-b border-orange-200 cursor-pointer hover:bg-orange-50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <div>
              <h4 className="font-semibold text-orange-900">{spine.name}</h4>
              <p className="text-sm text-orange-700">
                {spine.productUnits?.length || 0} единиц • {brands.length} брендов
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <StatusStats spines={[spine]} compact />
            <span className="text-sm text-orange-600">
              {isExpanded ? '▲' : '▼'}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="p-3">
            {brands.length > 1 && (
              <BrandTabs 
                brands={brands}
                activeBrand={activeBrand}
                onBrandChange={setActiveBrand}
                totalUnits={spine.productUnits?.length || 0}
              />
            )}
            
            {filteredUnits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredUnits.map((unit: any) => (
                  <UnitMiniCard key={unit.id} unit={unit} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-orange-500">
                <div className="text-3xl mb-2">📭</div>
                <p>Нет товаров</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// app/product-units/components/unit/BrandTabs.tsx
interface BrandTabsProps {
  brands: [string, any[]][];
  activeBrand: string;
  onBrandChange: (brand: string) => void;
  totalUnits: number;
}

function BrandTabs({ brands, activeBrand, onBrandChange, totalUnits }: BrandTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto mb-3">
      <button
        onClick={(e) => { e.stopPropagation(); onBrandChange("all"); }}
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
          {totalUnits}
        </span>
      </button>

      {brands.map(([brandName, brandUnits]) => (
        <button
          key={brandName}
          onClick={(e) => { e.stopPropagation(); onBrandChange(brandName); }}
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
  );
}