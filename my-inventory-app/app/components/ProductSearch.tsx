// app/components/ProductSearch.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProductUnit } from '@/app/lib/types/productUnit';

interface ProductSearchProps {
  onSelect: (productUnit: ProductUnit) => void;
  selectedProductUnit?: ProductUnit;
}

export default function ProductSearch({ onSelect, selectedProductUnit }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<ProductUnit[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/product-units/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Поиск товара
      </label>
      
      <input
        type="text"
        value={selectedProductUnit 
          ? `${selectedProductUnit.product.name} (${selectedProductUnit.serialNumber})`
          : searchTerm
        }
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
          if (selectedProductUnit) {
            onSelect(undefined as any);
          }
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Начните вводить название или серийный номер..."
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isOpen && (searchTerm.length > 0 || results.length > 0) && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-gray-500">Поиск...</div>
          ) : results.length === 0 ? (
            <div className="p-3 text-gray-500">Ничего не найдено</div>
          ) : (
            results.map((productUnit) => (
              <div
                key={productUnit.id}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  onSelect(productUnit);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <div className="font-medium">{productUnit.product.name}</div>
                <div className="text-sm text-gray-600">
                  Серийный: {productUnit.serialNumber} | 
                  Код: {productUnit.product.code} | 
                  {productUnit.status === 'IN_STORE' && ' В наличии'}
                  {productUnit.status === 'SOLD' && ' Продан'}
                  {productUnit.status === 'LOST' && ' Утерян'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}