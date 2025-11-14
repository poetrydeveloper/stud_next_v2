// app/components/DisassemblyScenarioForm.tsx (ПОЛНОСТЬЮ ПЕРЕПИСАННЫЙ)
'use client';

import { useState, useEffect } from 'react';

interface ProductUnit {
  id: number;
  serialNumber: string;
  productName?: string;
  productCode?: string;
  product?: {
    id: number;
    name: string;
    code: string;
  };
}

interface Product {
  id: number;
  code: string;
  name: string;
}

interface DisassemblyScenarioFormProps {
  unit: ProductUnit;
  onScenarioCreated?: () => void;
}

interface PartProduct {
  id: number | null;
  code: string;
  name: string;
}

export default function DisassemblyScenarioForm({
  unit,
  onScenarioCreated
}: DisassemblyScenarioFormProps) {
  const [partsCount, setPartsCount] = useState<number>(2);
  const [parts, setParts] = useState<PartProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSearchModal, setShowSearchModal] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Инициализируем части при изменении количества
  const initializeParts = (count: number) => {
    const newParts: PartProduct[] = [];
    for (let i = 0; i < count; i++) {
      newParts.push({
        id: null,
        code: '',
        name: ''
      });
    }
    setParts(newParts);
  };

  // При изменении количества частей
  const handlePartsCountChange = (count: number) => {
    if (count < 1) count = 1;
    if (count > 10) count = 10;
    
    setPartsCount(count);
    initializeParts(count);
  };

  // Поиск продуктов (не юнитов!)
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.ok) {
        setSearchResults(data.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Выбор продукта для части
  const handleSelectProduct = (product: Product, partIndex: number) => {
    const newParts = [...parts];
    newParts[partIndex] = {
      id: product.id,
      code: product.code,
      name: product.name
    };
    setParts(newParts);
    setShowSearchModal(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Создание сценария
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем что все части заполнены
    const emptyParts = parts.filter(part => !part.id);
    if (emptyParts.length > 0) {
      setError(`Заполните все ${emptyParts.length} части`);
      return;
    }

    // Проверяем что нет дубликатов продуктов
    const productCodes = parts.map(part => part.code);
    const uniqueCodes = new Set(productCodes);
    if (uniqueCodes.size !== productCodes.length) {
      setError('Нельзя использовать одинаковые продукты в разных частях');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/disassembly/scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Разборка на ${partsCount} частей`,
          parentProductCode: unit.product?.code || unit.productCode, // ← КОД продукта
          childProductCodes: parts.map(part => part.code) // ← КОДЫ продуктов
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error);
      }

      // Сброс формы
      setPartsCount(2);
      initializeParts(2);
      setError('');
      
      if (onScenarioCreated) {
        onScenarioCreated();
      }

      alert('Сценарий успешно создан!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Инициализация при первой загрузке
  useEffect(() => {
    initializeParts(partsCount);
  }, [partsCount]);

  return (
    <div className="p-6 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">
        Создать сценарий разборки
      </h3>
      
      <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Товар для разборки:</strong> {unit.productName || unit.product?.name}
        </p>
        <p className="text-sm text-blue-700">
          <strong>Код продукта:</strong> {unit.product?.code || unit.productCode}
        </p>
        <p className="text-sm text-blue-600">
          <strong>Серийный номер:</strong> {unit.serialNumber}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Количество частей */}
        <div>
          <label className="block text-sm font-medium mb-2">
            На сколько частей разобрать? *
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => handlePartsCountChange(partsCount - 1)}
              disabled={partsCount <= 1}
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-gray-300 transition-colors"
            >
              −
            </button>
            <span className="text-2xl font-bold w-12 text-center">{partsCount}</span>
            <button
              type="button"
              onClick={() => handlePartsCountChange(partsCount + 1)}
              disabled={partsCount >= 10}
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-gray-300 transition-colors"
            >
              +
            </button>
            <span className="text-sm text-gray-600">частей</span>
          </div>
        </div>

        {/* Список частей */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Выберите продукты для каждой части *
          </label>
          <div className="space-y-3">
            {parts.map((part, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    Часть {index + 1}
                  </span>
                  {part.id ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      ✅ Выбрано
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      ⏳ Ожидает выбора
                    </span>
                  )}
                </div>

                {part.id ? (
                  // Показать выбранный продукт
                  <div className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">
                          {part.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Код: {part.code}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newParts = [...parts];
                          newParts[index] = {
                            id: null,
                            code: '',
                            name: ''
                          };
                          setParts(newParts);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕ Удалить
                      </button>
                    </div>
                  </div>
                ) : (
                  // Кнопка поиска
                  <button
                    type="button"
                    onClick={() => setShowSearchModal(index)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
                  >
                    <span>+ Выбрать продукт для части {index + 1}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || parts.some(part => !part.id)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? 'Создание сценария...' : `Создать сценарий на ${partsCount} частей`}
        </button>
      </form>

      {/* Модальное окно поиска продуктов */}
      {showSearchModal !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Поиск продукта для части {showSearchModal + 1}
                </h3>
                <button
                  onClick={() => {
                    setShowSearchModal(null);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="mt-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  placeholder="Поиск по названию или коду продукта..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {searchLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Поиск продуктов...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product, showSearchModal)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Код: <span className="font-mono bg-gray-100 px-1 rounded">{product.code}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">🔍</div>
                  <p>Продукты не найдены</p>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">📦</div>
                  <p>Введите название или код продукта для поиска</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}