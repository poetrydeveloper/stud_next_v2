// app/components/DisassemblyScenarioForm.tsx
'use client';

import { useState } from 'react';

interface Product {
  id: number;
  code: string;
  name: string;
}

interface DisassemblyScenarioFormProps {
  parentUnitId: number;
  parentUnitName: string;
  availableProducts: Product[];
  onScenarioCreated?: () => void;
}

export default function DisassemblyScenarioForm({
  parentUnitId,
  parentUnitName,
  availableProducts,
  onScenarioCreated
}: DisassemblyScenarioFormProps) {
  const [name, setName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedProducts.length === 0) {
      setError('Заполните название и выберите продукты');
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
          name,
          parentUnitId,
          childProductsIds: selectedProducts
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error);
      }

      // Сброс формы
      setName('');
      setSelectedProducts([]);
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

  const toggleProduct = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">
        Создать сценарий разборки для: {parentUnitName}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Название сценария *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Например: Разборка набора ключей"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Выберите продукты для создания *
          </label>
          <div className="max-h-60 overflow-y-auto border rounded">
            {availableProducts.map(product => (
              <label key={product.id} className="flex items-center p-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  className="mr-2"
                />
                <span className="text-sm">
                  {product.code} - {product.name}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Выбрано: {selectedProducts.length} продуктов
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Создание...' : 'Создать сценарий'}
        </button>
      </form>
    </div>
  );
}