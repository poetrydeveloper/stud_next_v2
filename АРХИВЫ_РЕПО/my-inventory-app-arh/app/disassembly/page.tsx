// app/disassembly/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface ProductUnit {
  id: number;
  serialNumber: string;
  productName: string;
  statusProduct: string;
  disassemblyStatus: string;
  product: {
    code: string;
    name: string;
  };
}

interface DisassemblyScenario {
  id: number;
  name: string;
  parentUnitId: number;
  partsCount: number;
  isActive: boolean;
  parentUnit: ProductUnit;
}

export default function DisassemblyPage() {
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [scenarios, setScenarios] = useState<DisassemblyScenario[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Загружаем units
      const unitsResponse = await fetch('/api/product-units?take=100');
      const unitsResult = await unitsResponse.json();
      
      if (unitsResult.ok) {
        setUnits(unitsResult.data);
      }

      // Загружаем сценарии
      const scenariosResponse = await fetch('/api/disassembly/scenarios');
      const scenariosResult = await scenariosResponse.json();
      
      if (scenariosResult.ok) {
        setScenarios(scenariosResult.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableUnits = units.filter(unit => 
    unit.statusProduct === 'IN_STORE' && 
    unit.disassemblyStatus === 'MONOLITH'
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Управление разборкой товаров</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Секция доступных для разборки units */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Товары для разборки</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableUnits.map(unit => (
              <div
                key={unit.id}
                className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                  selectedUnitId === unit.id ? 'bg-blue-50 border-blue-300' : ''
                }`}
                onClick={() => setSelectedUnitId(unit.id)}
              >
                <div className="font-medium">{unit.product.name}</div>
                <div className="text-sm text-gray-600">
                  Артикул: {unit.product.code} | SN: {unit.serialNumber}
                </div>
                <div className="text-xs text-gray-500">
                  Статус: {unit.statusProduct} | Разборка: {unit.disassemblyStatus}
                </div>
              </div>
            ))}
            {availableUnits.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                Нет доступных товаров для разборки
              </div>
            )}
          </div>
        </div>

        {/* Секция сценариев */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Сценарии разборки</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {scenarios.map(scenario => (
              <div key={scenario.id} className="p-3 border rounded">
                <div className="font-medium">{scenario.name}</div>
                <div className="text-sm text-gray-600">
                  Родитель: {scenario.parentUnit.productName}
                </div>
                <div className="text-xs text-gray-500">
                  Частей: {scenario.partsCount} | 
                  Статус: {scenario.isActive ? 'Активен' : 'Неактивен'}
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700">
                    Выполнить
                  </button>
                  <button className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700">
                    Детали
                  </button>
                </div>
              </div>
            ))}
            {scenarios.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                Нет созданных сценариев
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Форма создания сценария */}
      {selectedUnitId && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Создание сценария</h2>
          {/* Здесь будет DisassemblyScenarioForm */}
          <div className="text-sm text-gray-500">
            Выбран товар ID: {selectedUnitId}
          </div>
        </div>
      )}
    </div>
  );
}