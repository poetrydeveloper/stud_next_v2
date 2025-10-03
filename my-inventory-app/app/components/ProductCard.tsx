// app/components/ProductCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
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

  const handleCreateUnit = async () => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      console.log("📥 Получен ответ от API:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        url: res.url
      });

      const contentType = res.headers.get("content-type") || "";
      console.log("📄 Content-Type ответа:", contentType);

      if (!contentType.includes("application/json")) {
        const textResponse = await res.text();
        console.error("❌ Ответ не JSON, получен текст:", textResponse.substring(0, 200));
        throw new Error("Unexpected response, probably HTML (404 or redirect).");
      }

      const data = await res.json();
      console.log("📊 Данные ответа от API:", data);

      if (!data.ok) {
        console.error("❌ Ошибка в ответе API:", data.error);
        throw new Error(data.error || "Ошибка создания карточки продукта");
      }

      console.log("✅ Успех! ProductUnit создан:", {
        unitId: data.data.id,
        serialNumber: data.data.serialNumber
      });
      
      // Редирект на страницу созданного ProductUnit
      router.push(`/product-units/${data.data.id}`);
      
    } catch (err: any) {
      console.error("💥 Ошибка в компоненте при создании ProductUnit:", {
        error: err.message,
        stack: err.stack
      });
      setError(err.message);
    } finally {
      console.log("🏁 Завершение операции создания");
      setLoading(false);
    }
  };

  const mainImage = product.images?.find((img) => img.isMain) || product.images?.[0];

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col justify-between">
      {mainImage && (
        <img
          src={mainImage.path}
          alt={mainImage.filename}
          className="w-full h-40 object-cover rounded mb-2"
        />
      )}
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p>Код: {product.code}</p>
      <p>Категория: {product.category?.name || "-"}</p>
      <p>Бренд: {product.brand?.name || "-"}</p>
      <p>Спайн: {product.spine?.name || "-"}</p>

      {/* Дополнительная информация для отладки */}
      <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
        <p>ID: {product.id} | SpineID: {product.spineId || "нет"}</p>
        <p>Изображений: {product.images?.length || 0}</p>
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
          <p className="text-red-600 text-sm font-semibold">Ошибка:</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleCreateUnit}
          disabled={loading}
          className={`px-3 py-1 rounded text-sm ${
            loading 
              ? "bg-gray-400 cursor-not-allowed text-gray-700" 
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
        >
          {loading ? "Создание..." : "Создать карточку продукта"}
        </button>

        <a
          href={`/products/${product.id}/edit`}
          className="text-yellow-600 text-sm hover:underline"
        >
          Редактировать
        </a>
      </div>
    </div>
  );
}