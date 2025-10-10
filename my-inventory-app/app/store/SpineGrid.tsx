// app/store/SpineGrid.tsx
"use client";

import { useState } from "react";
import SaleButtons from "@/app/store/SaleButtons";
import AssemblyButton from "@/app/store/AssemblyButton";

interface Spine {
  id: number;
  name: string;
  slug: string;
  brandData?: any;
  productUnits?: ProductUnit[];
}

interface ProductUnit {
  id: number;
  serialNumber: string;
  statusCard: string;
  statusProduct: string;
  productName?: string;
  productCode?: string;
  requestPricePerUnit?: number;
  salePrice?: number;
  soldAt?: string;
  isCredit?: boolean;
  customer?: {
    name: string;
    phone?: string;
  };
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
}

interface SpineGridProps {
  spines: Spine[];
  selectedBrand: string;
  selectedStatus: string;
}

interface Log {
  id: number;
  type: string;
  message: string;
  createdAt: string;
  meta?: any;
}

export default function SpineGrid({ spines, selectedBrand, selectedStatus }: SpineGridProps) {
  const [expandedSpines, setExpandedSpines] = useState<Record<number, boolean>>({});
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>({});
  const [unitLogs, setUnitLogs] = useState<Record<number, Log[]>>({});
  const [loadingLogs, setLoadingLogs] = useState<Record<number, boolean>>({});

  const toggleSpine = (spineId: number) => {
    setExpandedSpines(prev => ({
      ...prev,
      [spineId]: !prev[spineId]
    }));
  };

  const toggleUnitLogs = async (unitId: number) => {
    const newExpanded = !expandedUnits[unitId];
    setExpandedUnits(prev => ({ ...prev, [unitId]: newExpanded }));

    if (newExpanded && !unitLogs[unitId]) {
      setLoadingLogs(prev => ({ ...prev, [unitId]: true }));
      try {
        const response = await fetch(`/api/product-units/${unitId}/logs`);
        const data = await response.json();
        if (data.ok) {
          setUnitLogs(prev => ({ ...prev, [unitId]: data.data }));
        }
      } catch (error) {
        console.error('Ошибка загрузки логов:', error);
      } finally {
        setLoadingLogs(prev => ({ ...prev, [unitId]: false }));
      }
    }
  };

  const getFilteredUnits = (spine: Spine) => {
    if (!spine.productUnits) return [];
    return spine.productUnits.filter(unit => {
      const brandMatch = selectedBrand === "all" || unit.product?.brand?.name === selectedBrand;
      const statusMatch = selectedStatus === "all" || unit.statusCard === selectedStatus || unit.statusProduct === selectedStatus;
      return brandMatch && statusMatch;
    });
  };

  const getUnitsByBrand = (units: ProductUnit[]) => {
    const grouped: Record<string, ProductUnit[]> = {};
    units.forEach(unit => {
      const brandName = unit.product?.brand?.name || "Без бренда";
      if (!grouped[brandName]) grouped[brandName] = [];
      grouped[brandName].push(unit);
    });
    return grouped;
  };

  const getSpineStats = (spine: Spine) => {
    const units = spine.productUnits || [];
    return {
      total: units.length,
      inStore: units.filter(u => u.statusProduct === "IN_STORE").length,
      sold: units.filter(u => u.statusProduct === "SOLD").length,
      credit: units.filter(u => u.statusProduct === "CREDIT").length,
      inRequest: units.filter(u => u.statusCard === "IN_REQUEST").length,
      disassembled: units.filter(u => u.statusProduct === "IN_DISASSEMBLED").length,
    };
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { bg: string; text: string; border: string; label: string }> = {
      CLEAR: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", label: "CLEAR" },
      CANDIDATE: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200", label: "CANDIDATE" },
      SPROUTED: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200", label: "SPROUTED" },
      IN_REQUEST: { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200", label: "В заявке" },
      IN_DELIVERY: { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200", label: "В доставке" },
      ARRIVED: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", label: "Прибыл" },
      IN_STORE: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200", label: "На складе" },
      SOLD: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", label: "Продано" },
      CREDIT: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200", label: "В кредите" },
      LOST: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200", label: "Утеряно" },
      IN_DISASSEMBLED: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200", label: "Разобран" },
      IN_COLLECTED: { bg: "bg-teal-100", text: "text-teal-800", border: "border-teal-200", label: "Собран" }
    };
    return config[status] || { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200", label: status };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (spines.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-6xl mb-4">🏪</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Товары не найдены</h3>
        <p className="text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {spines.map(spine => {
        const filteredUnits = getFilteredUnits(spine);
        const unitsByBrand = getUnitsByBrand(filteredUnits);
        const stats = getSpineStats(spine);
        const isExpanded = expandedSpines[spine.id];

        return (
          <div key={spine.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="px-6 py-4 border-b border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => toggleSpine(spine.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`text-sm text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                    ▶
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{spine.name}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-1">
                      <span className="bg-white px-2 py-1 rounded border">📦 {stats.total}</span>
                      {stats.inStore > 0 && <span className="bg-white px-2 py-1 rounded border text-green-600">🏪 {stats.inStore}</span>}
                      {stats.sold > 0 && <span className="bg-white px-2 py-1 rounded border text-blue-600">✅ {stats.sold}</span>}
                      {stats.credit > 0 && <span className="bg-white px-2 py-1 rounded border text-orange-600">💳 {stats.credit}</span>}
                      {stats.inRequest > 0 && <span className="bg-white px-2 py-1 rounded border text-indigo-600">📋 {stats.inRequest}</span>}
                      {stats.disassembled > 0 && <span className="bg-white px-2 py-1 rounded border text-purple-600">🔧 {stats.disassembled}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center space-x-2">
                  <span>{isExpanded ? "Скрыть" : "Показать"}</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {filteredUnits.length} ед.
                  </span>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="p-6">
                {Object.keys(unitsByBrand).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    <div className="text-4xl mb-2">📭</div>
                    <p>Нет товаров по выбранным фильтрам</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(unitsByBrand).map(([brandName, brandUnits]) => (
                      <div key={brandName} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                              <span>🏷️</span>
                              <span>{brandName}</span>
                              <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
                                {brandUnits.length} ед.
                              </span>
                            </h4>
                          </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                          {brandUnits.map(unit => {
                            const productStatus = getStatusConfig(unit.statusProduct);
                            const cardStatus = getStatusConfig(unit.statusCard);

                            // ДОБАВЛЕНО: Отладочная информация
                            console.log('🔍 DEBUG Unit:', {
                              id: unit.id,
                              statusProduct: unit.statusProduct, 
                              shouldShowAssembly: unit.statusProduct === "IN_DISASSEMBLED"
                            });

                            return (
                              <div key={unit.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                                      {unit.product?.images?.[0] ? (
                                        <img
                                          src={unit.product.images[0].path}
                                          alt={unit.productName}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                          <span className="text-2xl">📦</span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                                        {unit.productName || unit.product?.name || "Без названия"}
                                      </h5>
                                      
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${productStatus.bg} ${productStatus.text} ${productStatus.border}`}>
                                          {productStatus.label}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${cardStatus.bg} ${cardStatus.text} ${cardStatus.border}`}>
                                          {cardStatus.label}
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                                        <span className="font-mono bg-gray-50 px-2 py-1 rounded border">
                                          {unit.serialNumber}
                                        </span>
                                        <span>Арт: {unit.productCode || unit.product?.code || "—"}</span>
                                        {unit.requestPricePerUnit && (
                                          <span className="text-green-600 font-semibold">
                                            💰 {unit.requestPricePerUnit} ₽
                                          </span>
                                        )}
                                        {unit.salePrice && (
                                          <span className="text-blue-600 font-semibold">
                                            💵 {unit.salePrice} ₽
                                          </span>
                                        )}
                                        {unit.soldAt && (
                                          <span className="text-gray-500">
                                            📅 {formatDate(unit.soldAt)}
                                          </span>
                                        )}
                                        {unit.customer?.name && (
                                          <span className="text-purple-600">
                                            👤 {unit.customer.name}
                                          </span>
                                        )}
                                      </div>

                                      <button
                                        onClick={() => toggleUnitLogs(unit.id)}
                                        disabled={loadingLogs[unit.id]}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 flex items-center space-x-1 mt-2"
                                      >
                                        <span>📊</span>
                                        <span>
                                          {loadingLogs[unit.id] ? "Загрузка..." : 
                                          expandedUnits[unit.id] ? "Скрыть логи" : "Показать логи"}
                                        </span>
                                        {unitLogs[unit.id] && (
                                          <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                                            {unitLogs[unit.id].length}
                                          </span>
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Действия - ИСПРАВЛЕННЫЙ БЛОК */}
                                  <div className="flex-shrink-0 ml-4 space-y-2">
                                    <SaleButtons 
                                      unit={unit}
                                      onSaleSuccess={() => window.location.reload()}
                                    />
                                    {/* ДОБАВЛЕНА ПРОВЕРКА ДЛЯ ОТЛАДКИ */}
                                    {unit.statusProduct === "IN_DISASSEMBLED" ? (
                                      <AssemblyButton 
                                        unit={unit}
                                        onAssemblySuccess={() => window.location.reload()}
                                      />
                                    ) : (
                                      <div className="text-xs text-gray-500 text-center">
                                        Статус: {unit.statusProduct}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {expandedUnits[unit.id] && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="text-xs text-gray-500 mb-3 font-medium">
                                      🕒 История изменений
                                    </div>
                                    {loadingLogs[unit.id] ? (
                                      <div className="text-center py-4 text-gray-500">
                                        Загрузка логов...
                                      </div>
                                    ) : unitLogs[unit.id] && unitLogs[unit.id].length > 0 ? (
                                      <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {unitLogs[unit.id].map((log) => (
                                          <div key={log.id} className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border">
                                            <div className="flex justify-between items-start mb-2">
                                              <span className="font-medium">{log.type}</span>
                                              <span className="text-gray-400">
                                                {formatDateTime(log.createdAt)}
                                              </span>
                                            </div>
                                            <div>{log.message}</div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-center py-4 text-gray-500">
                                        Логи отсутствуют
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}