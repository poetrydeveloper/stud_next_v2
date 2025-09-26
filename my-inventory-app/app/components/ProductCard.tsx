"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateUnit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/product-units/create-from-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Unexpected response, probably HTML (404 or redirect).");
      }

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "Ошибка создания карточки продукта");
      }

      // Редирект на страницу созданного ProductUnit
      router.push(`/product-units/${data.data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
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
      <p>Спайн: {product.spine?.name || "-"}</p> {/* ← добавили отображение spine */}

      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleCreateUnit}
          disabled={loading}
          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
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
