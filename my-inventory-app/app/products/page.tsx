// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface ProductImage {
  id: number;
  filename: string;
  path: string;
  isMain: boolean;
  productId: number;
}

interface Product {
  id: number;
  code: string;
  name: string;
  description: string | null;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  category: {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
  } | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [prices, setPrices] = useState<{ [key: number]: string }>({}); // Новое состояние для цен

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);

      // Инициализируем количества для каждого товара
      const initialQuantities: { [key: number]: number } = {};
      const initialPrices: { [key: number]: string } = {}; // Инициализируем цены
      
      data.forEach((product: Product) => {
        initialQuantities[product.id] = 1;
        initialPrices[product.id] = '0'; // Начальная цена 0
      });
      
      setQuantities(initialQuantities);
      setPrices(initialPrices); // Устанавливаем начальные цены
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId: number, value: number) => {
    const newValue = Math.max(1, value); // Минимум 1
    setQuantities(prev => ({
      ...prev,
      [productId]: newValue
    }));
  };

  // Новая функция для изменения цены
  const handlePriceChange = (productId: number, value: string) => {
    // Разрешаем только цифры и точку
    const numericValue = value.replace(/[^\d.]/g, '');
    setPrices(prev => ({
      ...prev,
      [productId]: numericValue
    }));
  };

  const addToRequest = async (productId: number) => {
    try {
      setAdding(productId);
      const quantity = quantities[productId] || 1;
      const pricePerUnit = prices[productId] || '0'; // Берем цену из состояния

      const res = await fetch('/api/request-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity,
          pricePerUnit // Добавляем цену в запрос
        }),
      });

      if (!res.ok) {
        console.error('Ошибка добавления в заявку');
        alert('Ошибка при добавлении товара');
      } else {
        console.log('Добавлено в кандидаты');
        alert(`Добавлено ${quantity} шт. по ${pricePerUnit} руб.`);
      }
    } catch (e) {
      console.error('Ошибка:', e);
      alert('Ошибка сети');
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Загрузка продуктов...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Все продукты</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full">

            {/* Изображение товара */}
            <div className="h-40 overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
              {product.images.length > 0 ? (
                <img
                  src={product.images[0].path}
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.objectFit = 'cover';
                    target.classList.add('p-0');
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Нет изображения</span>
                </div>
              )}
            </div>

            {/* Информация о товаре */}
            <div className="p-3 flex-1 flex flex-col">

              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                {product.name}
              </h3>

              <p className="text-xs text-gray-600 mb-2">
                Код: <span className="font-mono">{product.code}</span>
              </p>

              {/* Описание */}
              <div className="mb-3 flex-1">
                {product.description ? (
                  <p className="text-xs text-gray-700 line-clamp-3">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 italic">Нет описания</p>
                )}
              </div>

              {/* Категория */}
              <div className="mb-3 min-h-[24px]">
                {product.category ? (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {product.category.name}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 italic">Без категории</span>
                )}
              </div>

              {/* Новое поле для ввода цены */}
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">Цена за шт. (руб.):</label>
                <input
                  type="text"
                  value={prices[product.id] || '0'}
                  onChange={(e) => handlePriceChange(product.id, e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-0 focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              {/* Кнопка добавления и количество */}
              <div className="mt-auto pt-3 flex items-center gap-2">
                {/* Поле количества - компактное */}
                <div className="flex items-center border border-gray-300 rounded-md w-20 bg-white">
                  <button
                    onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-xs w-6 flex items-center justify-center"
                    disabled={quantities[product.id] <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                    className="w-8 text-center border-0 focus:ring-0 focus:outline-none text-xs py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-xs w-6 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Кнопка добавления */}
                <button
                  onClick={() => addToRequest(product.id)}
                  disabled={adding === product.id}
                  className="flex-1 bg-blue-600 text-white py-2 px-2 rounded-md text-xs hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {adding === product.id ? '...' : 'В заявку'}
                </button>
              </div>

              {/* Дополнительные изображения */}
              {product.images.length > 1 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Доп. фото: {product.images.length - 1}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <p className="text-gray-500 text-lg">Продуктов не найдено</p>
        </div>
      )}
    </div>
  );
}
