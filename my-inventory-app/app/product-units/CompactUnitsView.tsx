// app/product-units/CompactUnitsView.tsx (ИСПРАВЛЕННАЯ ВЕРСИЯ)
"use client";

import React, { useState } from "react";

interface ProductUnit {
  id: number;
  serialNumber: string;
  productName?: string;
  statusCard: string;
  statusProduct?: string;
  salePrice?: number;
  purchasePrice?: number;
  productCode?: string;
  product?: {
    name: string;
    code: string;
    brand?: {
      name: string;
    };
    spine?: {
      id: number;
      name: string;
    };
    category?: {
      name: string;
    };
    images?: Array<{
      path: string;
      isMain: boolean;
    }>;
  };
  spine?: {
    id: number;
    name: string;
  };
  logs?: Array<{
    id: number;
    type: string;
    message: string;
    createdAt: string;
  }>;
}

interface CompactUnitsViewProps {
  units: ProductUnit[];
}

export default function CompactUnitsView({ units }: CompactUnitsViewProps) {
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [activeSpineBrands, setActiveSpineBrands] = useState<{ [key: number]: number }>({});
  const [expandedSpines, setExpandedSpines] = useState<number[]>([]);

  // Группировка units по Spine
  const spinesMap = new Map();
  units.forEach(unit => {
    const spineId = unit.product?.spine?.id || unit.spine?.id || 0;
    const spineName = unit.product?.spine?.name || unit.spine?.name || "Без Spine";
    
    if (!spinesMap.has(spineId)) {
      spinesMap.set(spineId, {
        id: spineId,
        name: spineName,
        brands: new Map()
      });
    }
    
    const spine = spinesMap.get(spineId);
    const brandName = unit.product?.brand?.name || "Без бренда";
    
    if (!spine.brands.has(brandName)) {
      spine.brands.set(brandName, []);
    }
    spine.brands.get(brandName).push(unit);
  });

  const spines = Array.from(spinesMap.values());

  const toggleExpanded = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  const toggleSpineExpanded = (spineId: number) => {
    setExpandedSpines(prev =>
      prev.includes(spineId) ? prev.filter(id => id !== spineId) : [...prev, spineId]
    );
  };

  const handleQuantityChange = (unitId: number, value: number) => {
    setQuantities(prev => ({ ...prev, [unitId]: Math.max(1, value) }));
  };

  const handleAddToCandidate = async (unitId: number) => {
    const quantity = quantities[unitId] || 1;
    
    try {
      const res = await fetch("/api/product-units", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, quantity }),
      });

      const data = await res.json();
      
      if (data.ok) {
        alert(`Единица добавлена в кандидаты (${quantity} шт.)`);
        window.location.reload();
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (err) {
      alert("Произошла ошибка при добавлении в кандидаты");
    }
  };

  const setActiveBrand = (spineId: number, brandIndex: number) => {
    setActiveSpineBrands(prev => ({ ...prev, [spineId]: brandIndex }));
  };

  const getStatusBadge = (status: string, type: 'card' | 'product') => {
    const statusConfig = {
      card: {
        CLEAR: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'CLEAR' },
        CANDIDATE: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'CANDIDATE' },
        SPROUTED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'SPROUTED' },
        IN_REQUEST: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'IN_REQUEST' },
      },
      product: {
        IN_STORE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'На складе' },
        SOLD: { bg: 'bg-green-100', text: 'text-green-800', label: 'Продано' },
        CREDIT: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'В кредите' },
      }
    };

    const config = statusConfig[type][status as keyof typeof statusConfig[type]] || 
                  { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {spines.map(spine => {
        const brands = Array.from(spine.brands.entries());
        const activeBrandIndex = activeSpineBrands[spine.id] || 0;
        const activeBrand = brands[activeBrandIndex];
        const activeBrandUnits = activeBrand ? activeBrand[1] : [];
        const isSpineExpanded = expandedSpines.includes(spine.id);

        return (
          <div key={spine.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Шапка Spine с брендами - ТЕПЕРЬ КЛИКАБЕЛЬНАЯ */}
            <div 
              className="bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSpineExpanded(spine.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`transform transition-transform ${isSpineExpanded ? 'rotate-90' : ''}`}>
                    ▶
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{spine.name}</h3>
                </div>
                <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                  {brands.length} брендов • {units.filter(u => 
                    u.product?.spine?.id === spine.id || u.spine?.id === spine.id
                  ).length} единиц
                </span>
              </div>
              
              {/* Вкладки брендов - показываем только если Spine раскрыт */}
              {isSpineExpanded && (
                <div className="flex gap-1 overflow-x-auto mt-2">
                  {brands.map(([brandName, brandUnits], index) => {
                    const isActive = index === activeBrandIndex;
                    return (
                      <button
                        key={brandName}
                        onClick={(e) => { 
                          e.stopPropagation();
                          setActiveBrand(spine.id, index); 
                        }}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                          isActive 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        <span>{brandName}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {brandUnits.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Таблица units - показываем только если Spine раскрыт */}
            {isSpineExpanded && activeBrandUnits.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        Фото
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Товар
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Статусы
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Цены
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activeBrandUnits.map(unit => {
                      const mainImage = unit.product?.images?.find(img => img.isMain) || unit.product?.images?.[0];
                      const isExpanded = expandedUnits.includes(unit.id);
                      
                      return (
                        <React.Fragment key={unit.id}>
                          <tr className="hover:bg-gray-50 transition-colors">
                            {/* Фото */}
                            <td className="px-4 py-3">
                              <div className="w-10 h-10 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                                {mainImage ? (
                                  <img
                                    src={mainImage.path}
                                    alt={unit.productName || unit.product?.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <span className="text-lg">📦</span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Информация о товаре */}
                            <td className="px-4 py-3">
                              <div className="min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900 text-sm truncate">
                                    {unit.productName || unit.product?.name || "Без названия"}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3 text-xs text-gray-600">
                                  <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                    {unit.serialNumber}
                                  </span>
                                  <span>Арт: {unit.productCode || unit.product?.code || "—"}</span>
                                </div>
                              </div>
                            </td>

                            {/* Статусы */}
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                {getStatusBadge(unit.statusCard, 'card')}
                                {unit.statusProduct && getStatusBadge(unit.statusProduct, 'product')}
                              </div>
                            </td>

                            {/* Цены */}
                            <td className="px-4 py-3">
                              <div className="space-y-1 text-xs">
                                {unit.purchasePrice && (
                                  <div className="text-gray-600">
                                    Закуп: <span className="font-medium">{unit.purchasePrice} ₽</span>
                                  </div>
                                )}
                                {unit.salePrice && (
                                  <div className="text-green-600 font-medium">
                                    Продажа: {unit.salePrice} ₽
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Действия */}
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                {unit.statusCard === "CLEAR" && (
                                  <>
                                    <input
                                      type="number"
                                      min={1}
                                      max={10}
                                      value={quantities[unit.id] || 1}
                                      onChange={(e) => handleQuantityChange(unit.id, Number(e.target.value))}
                                      className="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center"
                                    />
                                    <button
                                      onClick={() => handleAddToCandidate(unit.id)}
                                      className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                    >
                                      В кандидаты
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => toggleExpanded(unit.id)}
                                  className="px-2 py-1 text-gray-600 border border-gray-300 text-xs rounded hover:bg-gray-50 transition-colors"
                                >
                                  {isExpanded ? "▲" : "▼"}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Раскрывающиеся детали */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className="px-4 py-3 bg-gray-50 border-t">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Информация</h4>
                                    <div className="space-y-1 text-xs">
                                      <div>
                                        <span className="text-gray-600">Spine:</span>{' '}
                                        <span className="font-medium">{spine.name}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Категория:</span>{' '}
                                        <span className="font-medium">{unit.product?.category?.name || "—"}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Бренд:</span>{' '}
                                        <span className="font-medium">{unit.product?.brand?.name || "—"}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Логи</h4>
                                    {unit.logs && unit.logs.length > 0 ? (
                                      <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {unit.logs.slice(0, 3).map(log => (
                                          <div key={log.id} className="text-xs border-l-2 border-blue-500 pl-2 py-1">
                                            <div className="flex justify-between">
                                              <span className="font-medium">{log.type}</span>
                                              <span className="text-gray-500">
                                                {new Date(log.createdAt).toLocaleDateString('ru-RU')}
                                              </span>
                                            </div>
                                            <p className="text-gray-600">{log.message}</p>
                                          </div>
                                        ))}
                                        {unit.logs.length > 3 && (
                                          <div className="text-xs text-gray-500 text-center">
                                            ... и еще {unit.logs.length - 3} записей
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-gray-500">Нет записей в логах</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Сообщение если нет units в выбранном бренде */}
            {isSpineExpanded && activeBrandUnits.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">📭</div>
                <p>Нет товаров в выбранном бренде</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}