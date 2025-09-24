// app/components/CreateProductUnitForm.tsx

"use client";

import { useState, useEffect } from "react";
import prisma from "@/app/lib/prisma";

interface ProductOption {
  id: number;
  name: string;
  code: string;
}

interface CreateProductUnitFormProps {
  onCreated: (unit: any) => void;
}

export default function CreateProductUnitForm({ onCreated }: CreateProductUnitFormProps) {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [deliveryId, setDeliveryId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [requestPricePerUnit, setRequestPricePerUnit] = useState<number>(0);

  useEffect(() => {
    // Загружаем продукты для селекта
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    const res = await fetch("/api/product-units", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selectedProductId,
        deliveryId,
        requestPricePerUnit,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      onCreated(data.data);
    } else {
      alert("Ошибка создания единицы: " + data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold mb-2">Создать единицу товара</h2>

      <div>
        <label className="block mb-1">Продукт:</label>
        <select
          className="w-full border rounded p-2"
          value={selectedProductId ?? ""}
          onChange={(e) => setSelectedProductId(Number(e.target.value))}
          required
        >
          <option value="">Выберите продукт</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.code})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Количество:</label>
        <input
          type="number"
          min={1}
          className="w-full border rounded p-2"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <div>
        <label className="block mb-1">Цена за единицу (заявка):</label>
        <input
          type="number"
          min={0}
          className="w-full border rounded p-2"
          value={requestPricePerUnit}
          onChange={(e) => setRequestPricePerUnit(Number(e.target.value))}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Создать
      </button>
    </form>
  );
}
