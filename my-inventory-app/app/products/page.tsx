// app/products/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import ProductRow from "@/app/components/ProductRow";

type ProductImage = { id: number; path: string };
type Product = {
  id: number;
  code: string;
  name: string;
  images?: ProductImage[];
};

type Stats = {
  inRequests: number;
  inStore: number;
  soldToday: number;
  lastUpdated?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [statsMap, setStatsMap] = useState<Record<number, Stats>>({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [prices, setPrices] = useState<Record<number, string>>({});

  const STATS_REFRESH_MS = 3 * 60 * 1000; // 3 минуты

  // Получаем продукты (без зависимостей)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data: Product[] = await res.json();
      setProducts(data);

      // Инициализируем количества и цены безопасно
      setQuantities(prev => {
        const updated = { ...prev };
        data.forEach(product => {
          if (updated[product.id] === undefined) {
            updated[product.id] = 1;
          }
        });
        return updated;
      });

      setPrices(prev => {
        const updated = { ...prev };
        data.forEach(product => {
          if (updated[product.id] === undefined) {
            updated[product.id] = "0";
          }
        });
        return updated;
      });
    } catch (e) {
      console.error("fetchProducts error", e);
    } finally {
      setLoading(false);
    }
  }, []); // Убраны проблемные зависимости

  // Получаем статистику для всех продуктов
  const fetchAllStats = useCallback(async (force = false) => {
    try {
      const url = "/api/product-stats" + (force ? "?force=1" : "");
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load stats");
      const data: Record<string, { inRequests: number; inStore: number; soldToday: number; lastUpdated: string }> =
        await res.json();

      // преобразуем ключи в числа
      const map: Record<number, Stats> = {};
      for (const k of Object.keys(data)) {
        const pid = Number(k);
        map[pid] = {
          inRequests: data[k].inRequests ?? 0,
          inStore: data[k].inStore ?? 0,
          soldToday: data[k].soldToday ?? 0,
          lastUpdated: data[k].lastUpdated ?? new Date().toISOString(),
        };
      }
      setStatsMap((prev) => ({ ...prev, ...map }));
    } catch (e) {
      console.error("fetchAllStats error", e);
    }
  }, []);

  // Получаем статистику для одного продукта
  const fetchStatsForProduct = useCallback(async (productId: number) => {
    try {
      const res = await fetch(`/api/product-stats?productId=${productId}&force=1`);
      if (!res.ok) throw new Error("Failed to load product stat");
      const payload = await res.json();
      const s = payload.stats;
      setStatsMap((prev) => ({
        ...prev,
        [productId]: {
          inRequests: s.inRequests ?? 0,
          inStore: s.inStore ?? 0,
          soldToday: s.soldToday ?? 0,
          lastUpdated: s.lastUpdated ?? new Date().toISOString(),
        },
      }));
    } catch (e) {
      console.error("fetchStatsForProduct error", e);
    }
  }, []);

  useEffect(() => {
    // первая загрузка продуктов и статистики
    (async () => {
      await fetchProducts();
      await fetchAllStats();
    })();

    // интервал для обновления статистики каждые 3 минуты
    const interval = setInterval(() => {
      fetchAllStats();
    }, STATS_REFRESH_MS);

    return () => clearInterval(interval);
  }, [fetchProducts, fetchAllStats, STATS_REFRESH_MS]);

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, value) }));
  };

  const handlePriceChange = (productId: number, value: string) => {
    const numeric = value.replace(/[^\d.]/g, "");
    setPrices((prev) => ({ ...prev, [productId]: numeric }));
  };

  // Добавление в заявку
  const addToRequest = async (productId: number) => {
    try {
      setAdding(productId);
      const quantity = quantities[productId] ?? 1;
      const pricePerUnit = prices[productId] ?? "0";

      const res = await fetch("/api/request-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, pricePerUnit }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Add to request failed:", text);
        alert("Ошибка при добавлении товара");
        return;
      }

      // После успешного добавления — обновляем статистику конкретного продукта
      await fetchStatsForProduct(productId);
    } catch (e) {
      console.error("addToRequest error", e);
      alert("Сетевая ошибка");
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center text-gray-500">Загрузка продуктов...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Все продукты</h1>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Продуктов не найдено</div>
      ) : (
        products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            stats={statsMap[product.id]}
            quantity={quantities[product.id] ?? 1}
            price={prices[product.id] ?? "0"}
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
