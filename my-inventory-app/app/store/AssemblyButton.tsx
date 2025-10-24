// app/store/AssemblyButton.tsx
'use client';

import { useState, useEffect } from 'react';

interface ProductUnit {
  id: number;
  serialNumber: string;
  statusProduct: string;
  productName?: string;
  productCode?: string;
  disassemblyScenarioId?: number;
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

interface DisassemblyScenario {
  id: number;
  name: string;
  parentProductCode: string;
  childProductCodes: string[];
  partsCount: number;
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
  const [scenario, setScenario] = useState<DisassemblyScenario | null>(null);
  const [availableUnits, setAvailableUnits] = useState<Record<string, ChildUnit[]>>({});
  const [selectedUnits, setSelectedUnits] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Загружаем сценарий и доступные юниты
  const loadAssemblyData = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔍 AssemblyButton loading data for unit:', unit.id);

      // 1. Загружаем сценарий
      if (!unit.disassemblyScenarioId) {
        throw new Error('У родительского unit нет сценария разборки');
      }

      const scenarioResponse = await fetch(`/api/disassembly/scenario/${unit.disassemblyScenarioId}`);
      const scenarioData = await scenarioResponse.json();

      if (!scenarioData.ok) {
        throw new Error(scenarioData.error || 'Ошибка загрузки сценария');
      }

      const loadedScenario = scenarioData.data;
      console.log('✅ Scenario loaded:', loadedScenario);
      setScenario(loadedScenario);

      // 2. Для каждого продукта в сценарии ищем доступные юниты
      const unitsByProduct: Record<string, ChildUnit[]> = {};
      
      for (const productCode of loadedScenario.childProductCodes) {
        const unitsResponse = await fetch(`/api/product-units/by-product-code?productCode=${productCode}&status=IN_STORE`);
        const unitsData = await unitsResponse.json();

        if (unitsData.ok) {
          // Фильтруем только MONOLITH и PARTIAL
          const filteredUnits = unitsData.data.filter((unit: ChildUnit) => 
            unit.disassemblyStatus === 'MONOLITH' || unit.disassemblyStatus === 'PARTIAL'
          );
          unitsByProduct[productCode] = filteredUnits;
        } else {
          unitsByProduct[productCode] = [];
        }
      }

      console.log('✅ Available units loaded:', unitsByProduct);
      setAvailableUnits(unitsByProduct);

    } catch (err: any) {
      console.error('💥 AssemblyButton load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Открываем модальное окно и загружаем данные
  const handleOpenModal = async () => {
    console.log('🔍 AssemblyButton opening modal for unit:', unit.id);
    setShowModal(true);
    setSelectedUnits({});
    await loadAssemblyData();
  };

  // Выбор юнита для продукта
  const handleUnitSelect = (productCode: string, unitId: number) => {
    setSelectedUnits(prev => ({
      ...prev,
      [productCode]: unitId
    }));
  };

  // Проверяем можно ли выполнить сборку
  const canAssemble = () => {
    if (!scenario) return false;
    
    // Должны быть выбраны юниты для всех продуктов сценария
    return scenario.childProductCodes.every(productCode => 
      selectedUnits[productCode] !== undefined
    );
  };

  // Выполнение сборки
  const handleAssembly = async () => {
    if (!scenario || !canAssemble()) {
      setError('Выберите юниты для всех частей сценария');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔍 AssemblyButton starting assembly:', {
        parentUnitId: unit.id,
        selectedUnits: selectedUnits,
        scenarioId: scenario.id
      });

      const childUnitIds = Object.values(selectedUnits);

      const response = await fetch('/api/disassembly/assemble', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentUnitId: unit.id,
          childUnitIds: childUnitIds,
          scenarioId: scenario.id
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error);
      }

      console.log('✅ AssemblyButton assembly successful:', result.data);
      setShowModal(false);
      setSelectedUnits({});
      setError('');
      
      if (onAssemblySuccess) {
        onAssemblySuccess();
      }

      alert('✅ Сборка выполнена успешно!');
    } catch (err: any) {
      console.error('💥 AssemblyButton assembly error:', err);
      setError(err.message);
      alert('❌ Ошибка сборки: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Получаем название продукта по коду
  const getProductName = (productCode: string) => {
    const units = availableUnits[productCode];
    if (units && units.length > 0) {
      return units[0].productName || units[0].product?.name || productCode;
    }
    return productCode;
  };

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
                    console.log('🔍 AssemblyButton closing modal');
                    setShowModal(false);
                    setSelectedUnits({});
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
              {scenario && (
                <p className="text-sm text-gray-500 mt-1">
                  Сценарий: {scenario.name} • Частей: {scenario.partsCount}
                </p>
              )}
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Загрузка данных для сборки...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <div className="text-4xl mb-2">❌</div>
                  <p>{error}</p>
                </div>
              ) : !scenario ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📋</div>
                  <p>Сценарий сборки не найден</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {scenario.childProductCodes.map((productCode, index) => {
                    const units = availableUnits[productCode] || [];
                    const selectedUnitId = selectedUnits[productCode];

                    return (
                      <div key={productCode} className="border border-gray-200 rounded-lg">
                        <div className="px-4 py-3 bg-gray-50 border-b">
                          <h4 className="font-semibold text-gray-900">
                            Часть {index + 1}: {getProductName(productCode)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Код: {productCode} • Доступно: {units.length} ед.
                            {selectedUnitId && (
                              <span className="ml-2 text-green-600">✓ Выбрано</span>
                            )}
                          </p>
                        </div>
                        
                        {units.length === 0 ? (
                          <div className="px-4 py-6 text-center text-gray-500">
                            <div className="text-2xl mb-2">📭</div>
                            <p>Нет доступных юнитов</p>
                            <p className="text-sm">Product Code: {productCode}</p>
                          </div>
                        ) : (
                          <div className="divide-y">
                            {units.map(unit => (
                              <div key={unit.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="radio"
                                    name={`product-${productCode}`}
                                    checked={selectedUnitId === unit.id}
                                    onChange={() => handleUnitSelect(productCode, unit.id)}
                                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                  />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {unit.serialNumber}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Статус: {unit.statusProduct} • {unit.disassemblyStatus}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      ID: {unit.id}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {unit.productName || unit.product?.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              {error && !loading && (
                <div className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded border border-red-200">
                  {error}
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {scenario && `Выбрано: ${Object.keys(selectedUnits).length} из ${scenario.partsCount} частей`}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedUnits({});
                      setError('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleAssembly}
                    disabled={isLoading || !canAssemble()}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isLoading ? 'Сборка...' : `Собрать (${Object.keys(selectedUnits).length}/${scenario?.partsCount || 0})`}
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