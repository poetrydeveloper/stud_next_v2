// app/components/inventory/InventoryVisual.tsx
"use client";
import { useState, useEffect } from 'react';

interface VisualProduct {
  id: number;
  name: string;
  code: string;
  category: string;
  brand: string;
  unitsInStore: number;
  salesLastWeek: number;
  bgClass: string;
  borderClass: string;
  recommendation: string;
  status: {
    stock: string;
    sales: string;
  };
}

interface VisualData {
  products: VisualProduct[];
  summary: {
    total: number;
    critical: number;
    warning: number;
    good: number;
    highSales: number;
  };
}

export default function InventoryVisual() {
  const [data, setData] = useState<VisualData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'high-sales'>('all');

  const loadVisualData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory/visual');
      const result = await response.json();
      
      if (result.ok) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error loading visual data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisualData();
  }, []);

  // Фильтрация продуктов
  const filteredProducts = data?.products.filter(product => {
    switch (filter) {
      case 'critical':
        return product.unitsInStore === 1;
      case 'warning':
        return product.unitsInStore > 1 && product.unitsInStore <= 5;
      case 'high-sales':
        return product.salesLastWeek >= 4;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Загрузка визуализации...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-2">Ошибка загрузки данных</div>
        <button
          onClick={loadVisualData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок и фильтры */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🧪 Визуализация запасов
              </h1>
              <p className="text-gray-600">
                Цветовая система: фон - остатки, бордер - продажи за неделю
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 border'
                }`}
              >
                Все ({data.summary.total})
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'critical' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-600 border'
                }`}
              >
                Критично ({data.summary.critical})
              </button>
              <button
                onClick={() => setFilter('warning')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'warning' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-white text-gray-600 border'
                }`}
              >
                Мало ({data.summary.warning})
              </button>
              <button
                onClick={() => setFilter('high-sales')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'high-sales' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-gray-600 border'
                }`}
              >
                Хот продажи ({data.summary.highSales})
              </button>
            </div>
          </div>

          {/* Легенда */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <h3 className="font-semibold mb-3">📖 Легенда</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium mb-2">Фон (остатки):</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                    <span>Красный - 1 шт (критично)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                    <span>Желтый - 2-5 шт (мало)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span>Зеленый - 6+ шт (много)</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Бордер (продажи/неделю):</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                    <span>Серый - 0-1 продаж</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border-2 border-yellow-400 rounded"></div>
                    <span>Желтый - 2-3 продаж</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border-2 border-red-400 rounded"></div>
                    <span>Красный - 4+ продаж</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts?.map((product) => (
            <div
              key={product.id}
              className={`
                ${product.bgClass} 
                ${product.borderClass}
                rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer
                min-h-[120px] flex flex-col justify-between
              `}
              title={`${product.name}\nОстаток: ${product.unitsInStore} шт\nПродажи за неделю: ${product.salesLastWeek}\n${product.recommendation}`}
            >
              <div>
                <div className="font-semibold text-sm mb-1 line-clamp-2">
                  {product.name}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {product.code}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{product.unitsInStore} шт</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🔥{product.salesLastWeek}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                {product.recommendation}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Нет товаров по выбранному фильтру
          </div>
        )}

        {/* Кнопка обновления */}
        <div className="flex justify-center mt-8">
          <button
            onClick={loadVisualData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            🔄 Обновить данные
          </button>
        </div>
      </div>
    </div>
  );
}