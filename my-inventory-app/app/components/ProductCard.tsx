// app/components/ProductCard.tsx

"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);

  const handleCreateUnit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/product-units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      const data = await res.json();
      if (data.ok) {
        alert(`Создана карточка: ${data.data[0].serialNumber}`);
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка");
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

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleCreateUnit}
          disabled={loading}
          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
        >
          {loading ? "Создание..." : "Создать карточку продукта"}
        </button>
        <Link
          href={`/products/${product.id}/edit`}
          className="text-yellow-600 text-sm hover:underline"
        >
          Редактировать
        </Link>
      </div>
    </div>
  );
}
