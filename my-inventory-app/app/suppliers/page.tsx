// app/suppliers/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Supplier {
  id: number;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  notes: string | null;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("/api/suppliers");
        if (!res.ok) throw new Error("Ошибка при загрузке данных");

        const data = await res.json();
        setSuppliers(data);
      } catch (err) {
        setError("Не удалось загрузить поставщиков");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Список поставщиков</h1>
        <Link
          href="/suppliers/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Создать поставщика
        </Link>
      </div>

      {suppliers.length === 0 ? (
        <p className="text-gray-600">Поставщиков пока нет.</p>
      ) : (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border-b">ID</th>
              <th className="p-3 text-left border-b">Имя</th>
              <th className="p-3 text-left border-b">Контактное лицо</th>
              <th className="p-3 text-left border-b">Телефон</th>
              <th className="p-3 text-left border-b">Заметки</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="p-3 border-b">{supplier.id}</td>
                <td className="p-3 border-b font-medium">{supplier.name}</td>
                <td className="p-3 border-b">
                  {supplier.contactPerson || "—"}
                </td>
                <td className="p-3 border-b">{supplier.phone || "—"}</td>
                <td className="p-3 border-b">{supplier.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
