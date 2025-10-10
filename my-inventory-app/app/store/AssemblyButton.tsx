'use client';

import { useState, useEffect } from 'react';

interface ProductUnit {
  id: number;
  serialNumber: string;
  statusProduct: string;
  productName?: string;
  productCode?: string;
}

interface ChildUnit {
  id: number;
  serialNumber: string;
  statusProduct: string;
  disassemblyStatus: string;
  productName?: string;
  productCode?: string;
  product?: {
    name: string;
    code: string;
  };
}

interface AssemblyButtonProps {
  unit: ProductUnit;
  onAssemblySuccess?: () => void;
}

export default function AssemblyButton({
  unit,
  onAssemblySuccess
}: AssemblyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [childUnits, setChildUnits] = useState<ChildUnit[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [error, setError] = useState('');

  // Загружаем доступные дочерние юниты
  const loadChildUnits = async () => {
    setLoadingChildren(true);
    try {
      const response = await fetch(`/api/disassembly/unit/${unit.id}/children`);
      const data = await response.json();

      if (data.ok) {
        setChildUnits(data.data || []);
      } else {
        throw new Error(data.error || 'Ошибка загрузки частей');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingChildren(false);
    }
  };

  // Открываем модальное окно и загружаем детей
  const handleOpenModal = async () => {
    setShowModal(true);
    await loadChildUnits();
  };

  // Выбор/снятие выбора юнита
  const toggleUnitSelection = (unitId: number) => {
    setSelectedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  // Выполнение сборки
  const handleAssembly = async () => {
    if (selectedUnits.length === 0) {
      setError('Выберите части для сборки');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/disassembly/assemble', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentUnitId: unit.id,
          childUnitIds: selectedUnits
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error);
      }

      setShowModal(false);
      setSelectedUnits([]);
      setError('');
      
      if (onAssemblySuccess) {
        onAssemblySuccess();
      }

      alert('✅ Сборка выполнена успешно!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Группируем детей по продуктам
  const childrenByProduct = childUnits.reduce((acc, child) => {
    const productCode = child.productCode || child.product?.code || 'unknown';
    if (!acc[productCode]) {
      acc[productCode] = {
        productName: child.productName || child.product?.name || 'Без названия',
        units: []
      };
    }
    acc[productCode].units.push(child);
    return acc;
  }, {} as Record<string, { productName: string; units: ChildUnit[] }>);

  return (
    <div>
      <button
        onClick={handleOpenModal}
        disabled={isLoading}
        className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-1"
        title="Собрать разобранный товар обратно в набор"
      >
        <span className="text-xs">🔧</span>
        <span>{isLoading ? '...' : 'Собрать'}</span>
      </button>
      
      {/* Модальное окно выбора юнитов */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Сборка набора: {unit.productName || unit.productCode}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUnits([]);
                    setError('');
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Выберите конкретные экземпляры для сборки обратно в набор
              </p>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {loadingChildren ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Загрузка доступных частей...</p>
                </div>
              ) : childUnits.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <p>Нет доступных частей для сборки</p>
                  <p className="text-sm mt-1">Все части уже проданы или используются</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(childrenByProduct).map(([productCode, { productName, units }]) => (
                    <div key={productCode} className="border border-gray-200 rounded-lg">
                      <div className="px-4 py-3 bg-gray-50 border-b">
                        <h4 className="font-semibold text-gray-900">
                          {productName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Код: {productCode} • Доступно: {units.length} ед.
                        </p>
                      </div>
                      <div className="divide-y">
                        {units.map(child => (
                          <div key={child.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedUnits.includes(child.id)}
                                onChange={() => toggleUnitSelection(child.id)}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {child.serialNumber}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Статус: {child.statusProduct} • {child.disassemblyStatus}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {child.productName || child.product?.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              {error && (
                <div className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded border border-red-200">
                  {error}
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Выбрано: {selectedUnits.length} из {childUnits.length} частей
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedUnits([]);
                      setError('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleAssembly}
                    disabled={isLoading || selectedUnits.length === 0}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isLoading ? 'Сборка...' : `Собрать (${selectedUnits.length})`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}