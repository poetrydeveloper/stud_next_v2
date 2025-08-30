// app/requests/candidates/page.tsx
"use client";

import { useEffect, useState } from "react";

type Status = "CANDIDATE" | "IN_REQUEST" | "EXTRA";

// ОБНОВЛЕННЫЙ ИНТЕРФЕЙС: Заменяем текстовые поля на объекты связей
interface Item {
  id: number;
  status: Status;
  quantity: number;
  deliveredQuantity: number;
  pricePerUnit: string; // Prisma Decimal сериализуется строкой
  supplierId: number | null;     // ID поставщика вместо текста
  supplier: {                    // Объект поставщика
    id: number;
    name: string;
    contactPerson: string | null;
    phone: string | null;
  } | null;
  customerId: number | null;     // ID заказчика вместо текста
  customer: {                    // Объект заказчика
    id: number;
    name: string;
    phone: string;
    email: string | null;
  } | null;
  product: {
    id: number; 
    code: string; 
    name: string;
    images: { path: string; isMain: boolean }[];
  };
  deliveryProgress: string;
  remainingQuantity: number;
  totalCost: string;
}

export default function CandidatesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  // Загрузка кандидатов, поставщиков и заказчиков
  const loadData = () => {
    // Загружаем кандидатов
    fetch("/api/request-items?status=candidate")
      .then((r) => r.json())
      .then((d) => { setItems(d); setLoading(false); });
    
    // Загружаем поставщиков
    fetch("/api/suppliers")
      .then((r) => r.json())
      .then(setSuppliers);
    
    // Загружаем заказчиков
    fetch("/api/customers")
      .then((r) => r.json())
      .then(setCustomers);
  };

  useEffect(loadData, []);

  // Изменение статуса товара
  const moveTo = async (id: number, status: Status) => {
    const res = await fetch(`/api/request-items/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) loadData();
    else alert("Не удалось изменить статус");
  };

  // Обновление поставщика для товара
  const updateSupplier = async (itemId: number, supplierId: number | null) => {
    const res = await fetch(`/api/request-items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId }),
    });
    if (res.ok) loadData();
    else alert("Не удалось обновить поставщика");
  };

  // Обновление заказчика для товара
  const updateCustomer = async (itemId: number, customerId: number | null) => {
    const res = await fetch(`/api/request-items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });
    if (res.ok) loadData();
    else alert("Не удалось обновить заказчика");
  };

  if (loading) return <div className="p-4">Загрузка…</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Предзаявки (кандидаты)</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Всего кандидатов: {items.length}
        </div>
        <button 
          onClick={loadData}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Обновить
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Товар</th>
              <th className="p-2 border">Код</th>
              <th className="p-2 border">Кол-во</th>
              <th className="p-2 border">Цена/ед</th>
              <th className="p-2 border">Итого</th>
              <th className="p-2 border">Поставщик</th>
              <th className="p-2 border">Заказчик</th>
              <th className="p-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-gray-50">
                <td className="p-2 border">{it.product.name}</td>
                <td className="p-2 border">{it.product.code}</td>
                <td className="p-2 border">{it.quantity}</td>
                <td className="p-2 border">{it.pricePerUnit} ₽</td>
                <td className="p-2 border font-semibold">{it.totalCost} ₽</td>
                
                {/* Выбор поставщика */}
                <td className="p-2 border">
                  <select
                    value={it.supplierId || ""}
                    onChange={(e) => updateSupplier(
                      it.id, 
                      e.target.value ? parseInt(e.target.value) : null
                    )}
                    className="w-full p-1 border rounded text-sm"
                  >
                    <option value="">Неизвестный поставщик</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </td>
                
                {/* Выбор заказчика */}
                <td className="p-2 border">
                  <select
                    value={it.customerId || ""}
                    onChange={(e) => updateCustomer(
                      it.id,
                      e.target.value ? parseInt(e.target.value) : null
                    )}
                    className="w-full p-1 border rounded text-sm"
                  >
                    <option value="">Выберите заказчика</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </td>
                
                {/* Кнопки действий */}
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => moveTo(it.id, "IN_REQUEST")}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    title="Добавить в основную заявку"
                  >
                    В заявку
                  </button>
                  <button
                    onClick={() => moveTo(it.id, "EXTRA")}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    title="Добавить в EXTRA-заявку"
                  >
                    В EXTRA
                  </button>
                </td>
              </tr>
            ))}
            
            {items.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={8}>
                  Нет кандидатов для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Информация о выбранных значениях */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p className="font-semibold">Информация:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Поставщик по умолчанию: "Неизвестный поставщик"</li>
          <li>Заказчик не выбран по умолчанию</li>
          <li>Изменения сохраняются автоматически</li>
        </ul>
      </div>
    </div>
  );
}