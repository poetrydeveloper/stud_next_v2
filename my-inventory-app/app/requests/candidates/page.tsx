// app/requests/candidates/page.tsx
"use client";

import { useEffect, useState } from "react";

type Status = "CANDIDATE" | "IN_REQUEST" | "EXTRA";

interface Item {
  id: number;
  status: Status;
  quantity: number;
  deliveredQuantity: number;
  pricePerUnit: string; // Prisma Decimal сериализуется строкой
  supplier: string;
  customer: string;
  product: {
    id: number; code: string; name: string;
    images: { path: string; isMain: boolean }[];
  };
  deliveryProgress: string;
  remainingQuantity: number;
  totalCost: string;
}

export default function CandidatesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/request-items?status=candidate")
      .then((r) => r.json())
      .then((d) => { setItems(d); setLoading(false); });
  };

  useEffect(load, []);

  const moveTo = async (id: number, status: Status) => {
    const res = await fetch(`/api/request-items/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
    else alert("Не удалось изменить статус");
  };

  if (loading) return <div className="p-4">Загрузка…</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Предзаявки (кандидаты)</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Товар</th>
              <th className="p-2 border">Код</th>
              <th className="p-2 border">Кол-во</th>
              <th className="p-2 border">Цена/ед</th>
              <th className="p-2 border">Итого</th>
              <th className="p-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td className="p-2 border">{it.product.name}</td>
                <td className="p-2 border">{it.product.code}</td>
                <td className="p-2 border">{it.quantity}</td>
                <td className="p-2 border">{it.pricePerUnit}</td>
                <td className="p-2 border">{it.totalCost}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => moveTo(it.id, "IN_REQUEST")}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    В заявку
                  </button>
                  <button
                    onClick={() => moveTo(it.id, "EXTRA")}
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    В EXTRA
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td className="p-4 text-center" colSpan={6}>Нет кандидатов</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
