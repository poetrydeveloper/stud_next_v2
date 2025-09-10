// app/customers/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers");
        if (!res.ok) throw new Error("Ошибка при загрузке данных");

        const data = await res.json();
        setCustomers(data.customers || data);
      } catch (err) {
        setError("Не удалось загрузить покупателей");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Список покупателей</h1>
        <Link
          href="/customers/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Создать покупателя
        </Link>
      </div>

      {customers.length === 0 ? (
        <p className="text-gray-600">Покупателей пока нет.</p>
      ) : (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border-b">ID</th>
              <th className="p-3 text-left border-b">Имя</th>
              <th className="p-3 text-left border-b">Телефон</th>
              <th className="p-3 text-left border-b">Email</th>
              <th className="p-3 text-left border-b">Заметки</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="p-3 border-b">{customer.id}</td>
                <td className="p-3 border-b font-medium">{customer.name}</td>
                <td className="p-3 border-b">{customer.phone}</td>
                <td className="p-3 border-b">{customer.email || "—"}</td>
                <td className="p-3 border-b">{customer.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
