// app/components/ProductCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/app/components/ProductImage";

interface ProductImage {
  id: number;
  path: string;
  localPath?: string;
  isMain: boolean;
}

interface Product {
  id: number;
  code: string;
  name: string;
  spineId?: number;
  spine?: {
    name: string;
  };
  category?: {
    name: string;
  };
  brand?: {
    name: string;
  };
  images?: ProductImage[];
}

interface ProductUnit {
  id: number;
  serialNumber: string;
  logs?: Array<{
    id: number;
    type: string;
    message: string;
    createdAt: string;
  }>;
}

interface ApiResponse {
  ok: boolean;
  data?: ProductUnit;
  error?: string;
  mode?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("🔄 ProductCard рендерится:", {
    productId: product.id,
    productName: product.name,
    spineId: product.spineId,
    spineName: product.spine?.name,
    hasSpine: !!product.spineId,
    category: product.category?.name,
    brand: product.brand?.name
  });

  const handleCreateUnit = async (): Promise<void> => {
    if (loading) return;
    
    console.log("🖱️ Нажата кнопка создания ProductUnit для продукта:", {
      productId: product.id,
      productName: product.name
    });
    
    setLoading(true);
    setError("");

    try {
      console.log("📤 Отправка запроса к API...");
      const res = await fetch("/api/product-units/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ productId: product.id }),
      });

      console.log("📥 Получен ответ от API:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
      });

      const contentType = res.headers.get("content-type") || "";
      console.log("📄 Content-Type ответа:", contentType);

      if (!contentType.includes("application/json")) {
        const textResponse = await res.text();
        console.error("❌ Ответ не JSON, получен текст:", textResponse.substring(0, 200));
        throw new Error("Неожиданный ответ от сервера (вероятно HTML ошибка)");
      }

      const data: ApiResponse = await res.json();
      console.log("📊 Данные ответа от API:", data);

      if (!data.ok || !data.data) {
        console.error("❌ Ошибка в ответе API:", data.error);
        throw new Error(data.error || "Ошибка создания карточки продукта");
      }

      console.log("✅ Успех! ProductUnit создан:", {
        unitId: data.data.id,
        serialNumber: data.data.serialNumber,
        mode: data.mode
      });

      // 🔥 ПРОВЕРЯЕМ ЛОГИ СОЗДАНИЯ
      if (data.data.logs && data.data.logs.length > 0) {
        console.log("📝 Созданные логи ProductUnit:", data.data.logs);
        data.data.logs.forEach((log, index) => {
          console.log(`  🪵 Лог ${index + 1}: ${log.type} - ${log.message}`);
        });
      } else {
        console.warn("⚠️ ProductUnit создан, но логи не найдены в ответе API");
      }
      
      // Редирект на страницу созданного ProductUnit
      console.log("🔄 Перенаправление на страницу ProductUnit:", data.data.id);
      router.push(`/product-units/${data.data.id}`);
      
    } catch (err: unknown) {
      console.error("💥 Ошибка в компоненте при создании ProductUnit:", err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Неизвестная ошибка при создании карточки продукта";
      
      setError(errorMessage);
    } finally {
      console.log("🏁 Завершение операции создания");
      setLoading(false);
    }
  };

  const mainImage = product.images?.find((img) => img.isMain) || product.images?.[0];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
      {/* Изображение продукта */}
      {mainImage ? (
        <ProductImage
          imagePath={mainImage.localPath || mainImage.path}
          alt={product.name}
          className="w-full h-40 object-cover rounded-md mb-3"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center border border-gray-200">
          <span className="text-gray-400 text-sm">Нет изображения</span>
        </div>
      )}

      {/* Информация о продукте */}
      <div className="flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h2>
        
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium">Код:</span> {product.code}</p>
          <p><span className="font-medium">Категория:</span> {product.category?.name || "-"}</p>
          <p><span className="font-medium">Бренд:</span> {product.brand?.name || "-"}</p>
          <p><span className="font-medium">Спайн:</span> {product.spine?.name || "-"}</p>
        </div>

        {/* Дополнительная информация для отладки */}
        <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200 text-xs">
          <p className="font-mono text-gray-500">
            ID: {product.id} | SpineID: {product.spineId || "нет"}
          </p>
          <p className="font-mono text-gray-500">
            Изображений: {product.images?.length || 0}
          </p>
          {mainImage && (
            <p className="font-mono text-gray-500 truncate">
              Путь: {mainImage.localPath || mainImage.path}
            </p>
          )}
        </div>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm font-semibold">Ошибка:</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleCreateUnit}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            loading 
              ? "bg-gray-300 cursor-not-allowed text-gray-500" 
              : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Создание...
            </span>
          ) : (
            "Создать карточку продукта"
          )}
        </button>

        <a
          href={`/products/${product.id}/edit`}
          className="text-yellow-600 hover:text-yellow-700 text-sm font-medium hover:underline transition-colors duration-200"
        >
          Редактировать
        </a>
      </div>
    </div>
  );
}