"use client";

import { useState } from "react";
import { ProductUnitCardStatus } from "@prisma/client";

interface SpineCardProps {
  spine: any;
}

export default function SpineCard_v2({ spine }: SpineCardProps) {
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [unitsState, setUnitsState] = useState(spine.productUnits);

  // Группировка units по брендам
  const brandsMap = new Map();
  unitsState.forEach(unit => {
    const brandName = unit.product.brand?.name || "Без бренда";
    if (!brandsMap.has(brandName)) brandsMap.set(brandName, []);
    brandsMap.get(brandName).push(unit);
  });
  const brands = Array.from(brandsMap.entries());
  const activeBrand = brands[activeBrandIndex];
  const activeBrandUnits = activeBrand ? activeBrand[1] : [];

  const toggleExpanded = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  const handleQuantityChange = (unitId: number, value: number) => {
    setQuantities(prev => ({ ...prev, [unitId]: Math.max(1, value) }));
  };

  const handleAddToCandidate = async (unitId: number) => {
    try {
      const res = await fetch("/api/product-units", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, quantity: 1 }),
      });
      if (res.ok) {
        setUnitsState(prev =>
          prev.map(u => u.id === unitId ? { ...u, statusCard: ProductUnitCardStatus.CANDIDATE } : u)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRequest = async (unitId: number, quantity: number) => {
    try {
      const res = await fetch("/api/product-units/create-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, quantity }),
      });
      if (res.ok) {
        setExpandedUnits(prev => prev.filter(id => id !== unitId));
        setQuantities(prev => ({ ...prev, [unitId]: 1 }));
        setUnitsState(prev =>
          prev.map(u => u.id === unitId ? { ...u, statusCard: ProductUnitCardStatus.IN_REQUEST } : u)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 hover:shadow-md transition-shadow duration-200 cursor-pointer w-80 h-96 flex flex-col">
      {/* Верхняя панель брендов */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 px-3 pt-1 pb-1 border-b border-gray-300 relative flex-shrink-0">
        <div className="flex justify-center gap-0.5 relative" style={{ height: "1.5rem" }}>
          {brands.map(([brandName, units], index) => {
            const isActive = index === activeBrandIndex;
            return (
              <button
                key={brandName}
                onClick={(e) => { e.stopPropagation(); setActiveBrandIndex(index); }}
                className={`relative transition-all duration-200 ease-in-out
                  ${isActive ? "z-20 -mt-1 bg-blue-500 text-white shadow-sm" : "z-10 bg-gray-300 text-gray-600 hover:bg-gray-400"}
                  px-2 py-0.5 rounded-t-md text-[10px] font-medium border border-b-0 min-w-[38px] h-5 flex flex-col items-center justify-center`}
              >
                <div className={`font-semibold leading-none ${isActive ? "text-white" : "text-gray-800"}`}>{brandName}</div>
                <div className={`text-[8px] leading-none ${isActive ? "text-blue-100" : "text-gray-500"}`}>{units.length}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Содержимое */}
      <div className="flex-1 flex flex-col p-3 overflow-hidden">
        {/* Название Spine */}
        <div className="mb-3 flex-shrink-0">
          <h3 className="text-xs text-gray-600 text-center mb-1">Spine</h3>
          <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
            <p className="text-sm text-gray-700 text-center font-medium truncate">{spine.name}</p>
          </div>
        </div>

        {/* ProductUnits */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {activeBrandUnits.map(unit => (
            <div key={unit.id} className="border border-gray-200 rounded-md p-2 bg-white flex-shrink-0">
              <div className="mb-2">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold text-gray-900 truncate">{unit.productName || "Без названия"}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded flex-shrink-0">{unit.productCode}</span>
                </div>
              </div>

              {/* Панель управления */}
              {unit.statusCard === ProductUnitCardStatus.CANDIDATE ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">Кандидат</span>
                    <button
                      onClick={() => toggleExpanded(unit.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex-shrink-0"
                    >
                      {expandedUnits.includes(unit.id) ? "Свернуть" : "Заявка →"}
                    </button>
                  </div>
                  {expandedUnits.includes(unit.id) && (
                    <div className="flex gap-2 items-center">
                      <input type="number" min={1} value={quantities[unit.id] || 1}
                        onChange={(e) => handleQuantityChange(unit.id, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                      <button onClick={() => handleCreateRequest(unit.id, quantities[unit.id] || 1)}
                        className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <button onClick={() => handleAddToCandidate(unit.id)}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 flex-shrink-0"
                  >
                    + Кандидат
                  </button>
                  <span className={`text-xs px-1 rounded flex-shrink-0`}>
                    {unit.statusProduct || "Нет статуса"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Статистика */}
        <div className="flex justify-between items-center text-[10px] text-gray-600 mt-3 pt-2 border-t flex-shrink-0">
          <span>Брендов: {brands.length}</span>
          <span>Всего: {spine._count.productUnits}</span>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-200 to-gray-300 h-1 border-t border-gray-400 flex-shrink-0"></div>
    </div>
  );
}