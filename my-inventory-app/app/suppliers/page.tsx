// app/suppliers/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Supplier {
  id: number;
  name: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("/api/suppliers");
      const data = await res.json();
      
      if (data.ok) {
        setSuppliers(data.data || []);
      } else {
        setError(data.error || "Ошибка загрузки поставщиков");
      }
    } catch (err) {
      setError("Ошибка при загрузке поставщиков");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Поставщики</h1>
      
      <Link 
        href="/suppliers/new" 
        className="mb-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Создать поставщика
      </Link>

      <div className="bg-white rounded shadow p-4 border">
        {loading ? (
          <p className="text-gray-500">Загрузка поставщиков...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : suppliers.length === 0 ? (
          <p className="text-gray-500">Поставщики пока не созданы</p>
        ) : (
          <ul className="space-y-2">
            {suppliers.map(supplier => (
              <li key={supplier.id} className="flex justify-between border-b pb-2 last:border-none">
                <span className="font-medium">{supplier.name}</span>
                <span className="text-xs text-gray-500">ID: {supplier.id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}