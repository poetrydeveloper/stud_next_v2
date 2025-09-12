// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ProductCard from "@/app/components/ProductCard";

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
          <ProductCard
            key={product.id}
            product={product}
            quantity={quantities[product.id] || 1}
            price={prices[product.id] || '0'}
            onQuantityChange={handleQuantityChange}
            onPriceChange={handlePriceChange}
            onAddToRequest={addToRequest}
            adding={adding === product.id}
          />
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
