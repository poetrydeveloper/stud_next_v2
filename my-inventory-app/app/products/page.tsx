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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToRequest = async (productId: number) => {
    try {
      setAdding(productId);
      const res = await fetch('/api/request-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        console.error('Ошибка добавления в заявку');
      } else {
        console.log('Добавлено в кандидаты');
      }
    } catch (e) {
      console.error('Ошибка:', e);
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return <div className="p-4">Загрузка продуктов...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Все продукты</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md">
            {/* Главное изображение */}
            {product.images.length > 0 ? (
              <img src={product.images[0].path} alt={product.name} className="w-full h-48 object-contain"/>
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-500">Нет изображения</span>
              </div>
            )}

            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2">Код: {product.code}</p>
            
            {product.description && (
              <p className="text-gray-700 mb-3">{product.description}</p>
            )}

            {product.category && (
              <p className="text-sm text-blue-600 mb-3">
                Категория: {product.category.name}
              </p>
            )}

            <button
              onClick={() => addToRequest(product.id)}
              disabled={adding === product.id}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {adding === product.id ? 'Добавляем...' : 'В заявку'}
            </button>

            {/* Все изображения продукта */}
            {product.images.length > 1 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Все изображения:</h4>
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.path}
                      alt={`${product.name} ${image.filename}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Продуктов не найдено</p>
        </div>
      )}
    </div>
  );
}
