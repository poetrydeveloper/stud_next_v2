// app/disassembly/scenario/[id]/page.tsx (ПОЛНЫЙ ИСПРАВЛЕННЫЙ КОД)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  code: string;
  name: string;
  brand?: {
    name: string;
  };
  category?: {
    name: string;
  };
}

interface DisassemblyScenario {
  id: number;
  name: string;
  parentProductCode: string;
  childProductCodes: string[];
  partsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ScenarioDetailPageProps {
  params: {
    id: string;
  };
}

export default function ScenarioDetailPage({ params }: ScenarioDetailPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [scenario, setScenario] = useState<DisassemblyScenario | null>(null);
  const [parentProduct, setParentProduct] = useState<Product | null>(null);
  const [childProducts, setChildProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scenarioId = Number(params.id);

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      if (isNaN(scenarioId)) {
        setError("Некорректный ID сценария");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Загружаем сценарий
        const scenarioResponse = await fetch(`/api/disassembly/scenario/${scenarioId}`);
        const scenarioData = await scenarioResponse.json();
        
        if (!scenarioData.ok) {
          throw new Error(scenarioData.error || "Сценарий не найден");
        }

        setScenario(scenarioData.data);

        // Загружаем родительский продукт
        const parentResponse = await fetch(`/api/products?code=${scenarioData.data.parentProductCode}`);
        const parentData = await parentResponse.json();
        
        if (parentData.ok && parentData.data.length > 0) {
          setParentProduct(parentData.data[0]);
        }

        // Загружаем дочерние продукты
        const childCodes = scenarioData.data.childProductCodes.join(',');
        const childResponse = await fetch(`/api/products?codes=${childCodes}`);
        const childData = await childResponse.json();
        
        if (childData.ok) {
          setChildProducts(childData.data);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [scenarioId]);

  // Функция для выполнения разборки
  const handleExecuteDisassembly = async () => {
    // Нужно выбрать unit для разборки
    const unitId = prompt("Введите ID unit для разборки:");
    if (!unitId) return;

    setIsLoading('execute');
    try {
      const response = await fetch('/api/disassembly/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId: Number(unitId),
          scenarioId: scenarioId
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        alert("Разборка выполнена успешно!");
        router.push('/store');
      } else {
        alert(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      alert('Ошибка сети');
    } finally {
      setIsLoading(null);
    }
  };

  // Функция для редактирования
  const handleEdit = () => {
    router.push(`/disassembly/scenario/${scenarioId}/edit`);
  };

  // Функция для деактивации/активации
  const handleToggleActive = async () => {
    if (!scenario) return;

    setIsLoading('toggle');
    try {
      const response = await fetch(`/api/disassembly/scenario/${scenarioId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !scenario.isActive })
      });

      const data = await response.json();
      
      if (data.ok) {
        setScenario(data.data); // Обновляем состояние
      } else {
        alert('Ошибка при изменении статуса');
      }
    } catch (error) {
      alert('Ошибка сети');
    } finally {
      setIsLoading(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка сценария...</p>
        </div>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ошибка</h1>
          <p className="text-gray-600 mb-6">{error || "Сценарий не найден"}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {scenario.name}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Создан: {formatDate(scenario.createdAt)}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                scenario.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {scenario.isActive ? 'Активен' : 'Неактивен'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Основная информация */}
            <div className="lg:col-span-2 space-y-6">
              {/* Информация о родительском продукте */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Родительский продукт
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Код продукта:</span>{' '}
                    <span className="font-mono text-gray-900">{scenario.parentProductCode}</span>
                  </div>
                  {parentProduct ? (
                    <>
                      <div>
                        <span className="font-medium">Название:</span>{' '}
                        <span className="text-gray-900">{parentProduct.name}</span>
                      </div>
                      {parentProduct.brand && (
                        <div>
                          <span className="font-medium">Бренд:</span>{' '}
                          <span className="text-gray-900">{parentProduct.brand.name}</span>
                        </div>
                      )}
                      {parentProduct.category && (
                        <div>
                          <span className="font-medium">Категория:</span>{' '}
                          <span className="text-gray-900">{parentProduct.category.name}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-yellow-600 bg-yellow-50 p-3 rounded border">
                      Продукт не найден в базе данных
                    </div>
                  )}
                </div>
              </div>

              {/* Дочерние продукты */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Дочерние продукты ({scenario.partsCount} шт.)
                </h2>
                <div className="space-y-3">
                  {childProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div>
                        <div className="font-medium text-gray-900">
                          Часть {index + 1}: {product.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Код: <span className="font-mono">{product.code}</span>
                          {product.brand && (
                            <span className="ml-3">
                              Бренд: {product.brand.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                  
                  {/* Показать отсутствующие продукты */}
                  {childProducts.length < scenario.partsCount && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-yellow-800 text-sm">
                        <strong>Внимание:</strong> {scenario.partsCount - childProducts.length} продукт(ов) не найдено в базе
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Боковая панель */}
            <div className="space-y-6">
              {/* Статус */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Статус сценария
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Частей:</span>
                    <span className="font-medium">{scenario.partsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Статус:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      scenario.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {scenario.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Создан:</span>
                    <span className="text-sm">{formatDate(scenario.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Действия */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Действия
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={handleExecuteDisassembly}
                    disabled={isLoading === 'execute'}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isLoading === 'execute' ? 'Выполнение...' : 'Выполнить разборку'}
                  </button>
                  
                  <button 
                    onClick={handleEdit}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
                  >
                    Редактировать
                  </button>
                  
                  <button 
                    onClick={handleToggleActive}
                    disabled={isLoading === 'toggle'}
                    className={`w-full text-white py-2 px-4 rounded-lg transition-colors ${
                      scenario.isActive 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    } disabled:bg-gray-400`}
                  >
                    {isLoading === 'toggle' ? 'Загрузка...' : 
                     scenario.isActive ? 'Деактивировать' : 'Активировать'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}