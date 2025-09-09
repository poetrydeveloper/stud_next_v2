"use client";

import { useEffect, useState } from "react";

interface Delivery {
  id: number;
  deliveryDate: string;
  quantity: number;
  status: string;
  supplierName: string;
  customerName: string;
  product: { name: string };
  pricePerUnit: string;
  createdAt: string;
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeliveries() {
      try {
        const res = await fetch("/api/deliveries");
        const data = await res.json();
        setDeliveries(data);
      } catch (e) {
        console.error("Ошибка при получении поставок:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDeliveries();
  }, []);

  if (loading) return <p>Загрузка поставок...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Поставки</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Дата поставки</th>
            <th className="border p-2 text-left">Товар</th>
            <th className="border p-2 text-left">Количество</th>
            <th className="border p-2 text-left">Статус</th>
            <th className="border p-2 text-left">Поставщик</th>
            <th className="border p-2 text-left">Покупатель</th>
            <th className="border p-2 text-left">Цена за единицу</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((d) => (
            <tr key={d.id}>
              <td className="border p-2">{d.id}</td>
              <td className="border p-2">{new Date(d.deliveryDate).toLocaleDateString()}</td>
              <td className="border p-2">{d.product.name}</td>
              <td className="border p-2">{d.quantity}</td>
              <td className="border p-2">{d.status}</td>
              <td className="border p-2">{d.supplierName}</td>
              <td className="border p-2">{d.customerName}</td>
              <td className="border p-2">{d.pricePerUnit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
