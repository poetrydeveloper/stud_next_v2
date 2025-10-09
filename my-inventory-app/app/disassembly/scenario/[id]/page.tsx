// app/disassembly/scenario/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ScenarioDetail {
  id: number;
  name: string;
  parentUnitId: number;
  partsCount: number;
  childProductsIds: number[];
  partialChildUnits: number[];
  isActive: boolean;
  parentUnit: {
    id: number;
    serialNumber: string;
    productName: string;
    statusProduct: string;
    disassemblyStatus: string;
    product: {
      code: string;
      name: string;
    };
  };
}

export default function ScenarioDetailPage() {
  const params = useParams();
  const scenarioId = params.id as string;
  
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [validation, setValidation] = useState<any>(null);

  useEffect(() => {
    if (scenarioId) {
      loadScenario();
      validateScenario();
    }
  }, [scenarioId]);

  const loadScenario = async () => {
    try {
      const response = await fetch(`/api/disassembly/scenario/${scenarioId}`);
      const result = await response.json();
      
      if (result.ok) {
        setScenario(result.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки сценария:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateScenario = async () => {
    try {
      const response = await fetch(`/api/disassembly/scenario/validate/${scenarioId}`);
      const result = await response.json();
      
      if (result.ok) {
        setValidation(result.data);
      }
    } catch (error) {
      console.error('Ошибка валидации:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Загрузка сценария...</div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">Сценарий не найден</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Сценарий: {scenario.name}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Информация о сценарии */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Информация</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">ID:</span> {scenario.id}
            </div>
            <div>
              <span className="font-medium">Родительский товар:</span> {scenario.parentUnit.product.name}
            </div>
            <div>
              <span className="font-medium">Серийный номер:</span> {scenario.parentUnit.serialNumber}
            </div>
            <div>
              <span className="font-medium">Количество частей:</span> {scenario.partsCount}
            </div>
            <div>
              <span className="font-medium">Статус:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                scenario.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {scenario.isActive ? 'Активен' : 'Неактивен'}
              </span>
            </div>
          </div>
        </div>

        {/* Валидация */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Валидация</h2>
          {validation && (
            <div className="space-y-2">
              <div className={`flex items-center ${
                validation.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="font-medium">Продукты:</span>
                <span className="ml-2">
                  {validation.productsFound}/{validation.productsRequired} найдено
                </span>
              </div>
              <div className={`flex items-center ${
                validation.canExecute ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="font-medium">Готов к выполнению:</span>
                <span className="ml-2">
                  {validation.canExecute ? 'Да' : 'Нет'}
                </span>
              </div>
              {validation.missingProducts > 0 && (
                <div className="text-red-600 text-sm">
                  Отсутствует продуктов: {validation.missingProducts}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Кнопка выполнения */}
      <div className="mt-6">
        {validation?.canExecute && (
          <button className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700">
            Выполнить разборку
          </button>
        )}
      </div>
    </div>
  );
}