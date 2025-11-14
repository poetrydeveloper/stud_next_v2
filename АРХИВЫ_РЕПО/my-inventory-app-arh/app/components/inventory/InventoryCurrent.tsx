// app/components/inventory/InventoryCurrent.tsx
"use client";
import { useState, useEffect } from 'react';

interface InventoryUnit {
  id: number;
  serialNumber: string;
  statusProduct: string;
  salePrice: number;
  createdAt: string;
}

interface InventoryProduct {
  productId: number;
  productName: string;
  productCode: string;
  category: string;
  brand: string;
  unitsInStore: number;
  totalValue: number;
  units: InventoryUnit[];
}

export default function InventoryCurrent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    productCode: ''
  });

  const loadInventory = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.brand) queryParams.append('brand', filters.brand);
      if (filters.productCode) queryParams.append('productCode', filters.productCode);

      const response = await fetch(`/api/inventory/current?${queryParams}`);
      const result = await response.json();
      
      if (result.ok) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Загрузка остатков...</div>
      </div>
    );
  }

  if (!data) {
    return <div>Ошибка загрузки данных</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Текущие остатки</h1>
        <div className="text-sm text-gray-500">
          Обновлено: {new Date(data.timestamp).toLocaleString()}
        </div>
      </div>

      {/* KPI карточки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{data.totalUnits}</div>
          <div className="text-gray-600">Всего единиц</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-green-600">{data.totalProducts}</div>
          <div className="text-gray-600">Позиций</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {data.products.reduce((sum: number, p: InventoryProduct) => sum + p.totalValue, 0).toLocaleString()} ₽
          </div>
          <div className="text-gray-600">Общая стоимость</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Категория"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Бренд"
            value={filters.brand}
            onChange={(e) => setFilters({...filters, brand: e.target.value})}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Код товара"
            value={filters.productCode}
            onChange={(e) => setFilters({...filters, productCode: e.target.value})}
            className="border rounded px-3 py-2"
          />
        </div>
        <button
          onClick={loadInventory}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Применить фильтры
        </button>
      </div>

      {/* Таблица продуктов */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Товар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Бренд
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Единиц
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Стоимость
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.products.map((product: InventoryProduct) => (
                <tr key={product.productId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{product.productName}</div>
                    <div className="text-sm text-gray-500">{product.productCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.unitsInStore} шт
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.totalValue.toLocaleString()} ₽
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}