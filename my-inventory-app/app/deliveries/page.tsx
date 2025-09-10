// app/deliveries/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Product {
  name: string;
}

interface Delivery {
  id: number;
  deliveryDate: string;
  quantity: number;
  status: string;
  supplierName: string;
  customerName: string;
  product: Product;
  pricePerUnit: string;
  createdAt: string;
}

interface ApiResponse {
  deliveries: Delivery[];
  totalSum: number;
  date: string;
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [totalSum, setTotalSum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeliveries() {
      try {
        const res = await fetch("/api/deliveries");
        if (!res.ok) throw new Error("Ошибка загрузки");
        
        const data: ApiResponse = await res.json();
        setDeliveries(data.deliveries);
        setTotalSum(data.totalSum);
      } catch (e) {
        console.error("Ошибка при получении поставок:", e);
        setError("Не удалось загрузить поставки");
      } finally {
        setLoading(false);
      }
    }
    fetchDeliveries();
  }, []);

  if (loading) return <div className="p-6">Загрузка поставок...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Поставки</h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          Общая сумма: {totalSum} ₽
        </div>
      </div>

      {deliveries.length === 0 ? (
        <p className="text-gray-600">Поставок пока нет.</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 mb-4">
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
                <th className="border p-2 text-left">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => {
                const itemSum = Number(d.pricePerUnit) * d.quantity;
                
                return (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="border p-2">{d.id}</td>
                    <td className="border p-2">
                      {new Date(d.deliveryDate).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="border p-2">{d.product.name}</td>
                    <td className="border p-2">{d.quantity}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        d.status === 'FULL' ? 'bg-green-100 text-green-800' :
                        d.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                        d.status === 'OVER' ? 'bg-orange-100 text-orange-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="border p-2">{d.supplierName}</td>
                    <td className="border p-2">{d.customerName}</td>
                    <td className="border p-2">{d.pricePerUnit} ₽</td>
                    <td className="border p-2 font-medium">{itemSum} ₽</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold">Итого за день: {totalSum} ₽</p>
          </div>
        </>
      )}
    </div>
  );
}