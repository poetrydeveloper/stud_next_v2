// app/deliveries/DeliveryUnitsGrid.tsx
"use client";

import { useState } from "react";

interface Log {
  id: number;
  type: string;
  message: string;
  createdAt: string;
  meta?: any;
}

interface DeliveryUnit {
  id: number;
  serialNumber: string;
  productName?: string;
  requestPricePerUnit?: number;
  createdAtRequest?: Date;
  parentProductUnitId?: number;
  parentProductUnit?: {
    id: number;
    serialNumber: string;
    productName?: string;
  };
  childProductUnits?: DeliveryUnit[];
  product?: {
    name: string;
    code: string;
    brand?: {
      name: string;
    };
    images?: Array<{
      path: string;
    }>;
  };
  spine?: {
    name: string;
  };
  logs?: Log[]; // ДОБАВЛЕНО
}

interface DeliveryUnitsGridProps {
  groupedUnits: Record<string, DeliveryUnit[]>;
}

export default function DeliveryUnitsGrid({ groupedUnits }: DeliveryUnitsGridProps) {
  const [loadingUnits, setLoadingUnits] = useState<Record<number, boolean>>({});
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>({});
  const [unitLogs, setUnitLogs] = useState<Record<number, Log[]>>({});
  const [loadingLogs, setLoadingLogs] = useState<Record<number, boolean>>({});

  const handleAcceptDelivery = async (unitId: number) => {
    setLoadingUnits(prev => ({ ...prev, [unitId]: true }));
    
    try {
      const response = await fetch(`/api/product-units/${unitId}/delivery`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      
      if (data.ok) {
        alert("Товар принят на склад!");
        window.location.reload();
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (error) {
      alert("Ошибка сети");
    } finally {
      setLoadingUnits(prev => ({ ...prev, [unitId]: false }));
    }
  };

  // Функция загрузки логов
  const loadLogs = async (unitId: number) => {
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
  };

  // Функция переключения отображения логов
  const toggleLogs = (unitId: number) => {
    const newExpanded = !expandedUnits[unitId];
    setExpandedUnits(prev => ({ ...prev, [unitId]: newExpanded }));
    
    // Если открываем и логи еще не загружены - загружаем
    if (newExpanded && !unitLogs[unitId]) {
      loadLogs(unitId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Группируем units по SPROUTED родителям
  const organizeByParents = (units: DeliveryUnit[]) => {
    const parents: DeliveryUnit[] = [];
    const children: DeliveryUnit[] = [];
    
    units.forEach(unit => {
      if (unit.parentProductUnitId) {
        children.push(unit);
      } else {
        parents.push(unit);
      }
    });

    const organized = [...parents];
    parents.forEach(parent => {
      const parentChildren = children.filter(child => 
        child.parentProductUnitId === parent.id
      );
      if (parentChildren.length > 0) {
        organized.push(...parentChildren);
      }
    });

    const orphanChildren = children.filter(child => 
      !parents.some(parent => parent.id === child.parentProductUnitId)
    );
    organized.push(...orphanChildren);

    return organized;
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedUnits).map(([date, units]) => (
        <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Заголовок даты */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              📅 {date === 'no-date' ? 'Без даты' : formatDate(date)}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {units.length} единиц товара
            </p>
          </div>

          {/* Список units */}
          <div className="divide-y divide-gray-200">
            {organizeByParents(units).map((unit) => (
              <div 
                key={unit.id}
                className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                  unit.parentProductUnitId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Левая часть: Информация о товаре */}
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Изображение */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      {unit.product?.images?.[0] ? (
                        <img
                          src={unit.product.images[0].path}
                          alt={unit.productName || unit.product?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <span className="text-xs text-gray-400">📦</span>
                        </div>
                      )}
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      {/* Заголовок SPROUTED родителя */}
                      {unit.parentProductUnit && (
                        <div className="mb-2 pb-2 border-b border-blue-200">
                          <div className="text-xs text-blue-600 font-medium">
                            📋 Родительская заявка
                          </div>
                          <div className="text-sm text-blue-800">
                            {unit.parentProductUnit.productName || unit.parentProductUnit.serialNumber}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {unit.productName || unit.product?.name || "Без названия"}
                        </h3>
                        {unit.product?.brand && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border">
                            🏷️ {unit.product.brand.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="font-mono bg-gray-50 px-2 py-1 rounded border">
                          {unit.serialNumber}
                        </span>
                        <span>
                          Арт: {unit.product?.code || "—"}
                        </span>
                        {unit.requestPricePerUnit && (
                          <span className="text-green-600 font-semibold">
                            💰 {unit.requestPricePerUnit} ₽/шт
                          </span>
                        )}
                        {unit.spine && (
                          <span className="text-blue-600">
                            📋 {unit.spine.name}
                          </span>
                        )}
                      </div>

                      {/* Кнопка просмотра логов */}
                      <div className="mt-2">
                        <button
                          onClick={() => toggleLogs(unit.id)}
                          disabled={loadingLogs[unit.id]}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium disabled:opacity-50 flex items-center gap-1"
                        >
                          📊 {loadingLogs[unit.id] ? "Загрузка..." : (expandedUnits[unit.id] ? "Скрыть логи" : "Показать логи")} 
                          {unitLogs[unit.id] && ` (${unitLogs[unit.id].length})`}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Правая часть: Кнопка принятия */}
                  <div className="flex-shrink-0 ml-4 flex flex-col items-end space-y-2">
                    <button
                      onClick={() => handleAcceptDelivery(unit.id)}
                      disabled={loadingUnits[unit.id]}
                      className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      {loadingUnits[unit.id] ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Приемка...</span>
                        </div>
                      ) : (
                        "ПРИНЯТЬ"
                      )}
                    </button>
                  </div>
                </div>

                {/* Блок логов (раскрывается) */}
                {expandedUnits[unit.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-2 font-medium">🕒 История изменений:</div>
                    {loadingLogs[unit.id] ? (
                      <div className="text-xs text-gray-500 text-center py-3 bg-gray-50 rounded border">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
                        Загрузка логов...
                      </div>
                    ) : unitLogs[unit.id] && unitLogs[unit.id].length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {unitLogs[unit.id].map((log) => (
                          <div key={log.id} className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium bg-white px-2 py-1 rounded text-xs border">
                                {log.type}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDateTime(log.createdAt)}
                              </span>
                            </div>
                            <div className="text-xs leading-relaxed">{log.message}</div>
                            {log.meta && (
                              <div className="mt-1 text-xs text-gray-500 bg-white p-1 rounded border">
                                {JSON.stringify(log.meta, null, 2)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 text-center py-3 bg-gray-50 rounded border">
                        📭 Логи отсутствуют
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(groupedUnits).length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Нет ожидающих поставок</h3>
          <p className="text-gray-500">Все заявки обработаны или поставок нет</p>
        </div>
      )}
    </div>
  );
}