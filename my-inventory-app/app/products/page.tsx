// app/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import ProductRow from "@/app/components/ProductRow";

interface Product {
  id: number;
  code: string;
  name: string;
  description: string | null;
  images: { id: number; path: string }[];
  inStock?: number;
  inRequests?: number;
  soldToday?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [prices, setPrices] = useState<{ [key: number]: string }>({});

  // Загружаем продукты
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();

      // Добавляем тестовые поля (в реальности подтягивать из БД)
      const enrichedData = data.map((p: Product) => ({
        ...p,
        inStock: Math.floor(Math.random() * 100),
        inRequests: Math.floor(Math.random() * 10),
        soldToday: Math.floor(Math.random() * 5),
      }));

      setProducts(enrichedData);

      // Инициализируем кол-во и цену
      const initialQuantities: { [key: number]: number } = {};
      const initialPrices: { [key: number]: string } = {};
      enrichedData.forEach((product: Product) => {
        initialQuantities[product.id] = 1;
        initialPrices[product.id] = "0";
      });
      setQuantities(initialQuantities);
      setPrices(initialPrices);
    } catch (error) {
      console.error("Ошибка загрузки продуктов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 180000); // обновляем каждые 3 мин
    return () => clearInterval(interval);
  }, []);

  const handleQuantityChange = (productId: number, value: number) => {
    const newValue = Math.max(1, value);
    setQuantities((prev) => ({
      ...prev,
      [productId]: newValue,
    }));
  };

  const handlePriceChange = (productId: number, value: string) => {
    const numericValue = value.replace(/[^\d.]/g, "");
    setPrices((prev) => ({
      ...prev,
      [productId]: numericValue,
    }));
  };

  const addToRequest = async (productId: number) => {
    try {
      setAdding(productId);
      const quantity = quantities[productId] || 1;
      const pricePerUnit = prices[productId] || "0";

      const res = await fetch("/api/request-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
          pricePerUnit,
        }),
      });

      if (!res.ok) {
        console.error("Ошибка добавления в заявку");
        alert("Ошибка при добавлении товара");
      } else {
        alert(`Добавлено ${quantity} шт. по ${pricePerUnit} руб.`);
        fetchProducts(); // сразу обновляем данные
      }
    } catch (e) {
      console.error("Ошибка:", e);
      alert("Ошибка сети");
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        Загрузка продуктов...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Все продукты</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <p className="text-gray-500 text-lg">Продуктов не найдено</p>
        </div>
      ) : (
        products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            quantity={quantities[product.id]}
            price={prices[product.id]}
            onQuantityChange={handleQuantityChange}
            onPriceChange={handlePriceChange}
            onAddToRequest={addToRequest}
            adding={adding === product.id}
          />
        ))
      )}
    </div>
  );
}
