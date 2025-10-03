// app/customers/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Customer {
  id: number;
  name: string;
  phone: string | null;
  notes: string | null;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers")
      .then(res => res.json())
      .then(data => {
        setCustomers(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка при загрузке клиентов:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Клиенты</h1>
      
      <Link 
        href="/customers/new" 
        className="mb-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Создать клиента
      </Link>

      <div className="bg-white rounded shadow p-4 border">
        {loading ? (
          <p className="text-gray-500">Загрузка клиентов...</p>
        ) : customers.length === 0 ? (
          <p className="text-gray-500">Клиенты пока не созданы</p>
        ) : (
          <div className="space-y-4">
            {customers.map(customer => (
              <div key={customer.id} className="border-b pb-4 last:border-none">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    {customer.phone && (
                      <p className="text-gray-600">📞 {customer.phone}</p>
                    )}
                    {customer.notes && (
                      <p className="text-gray-500 text-sm mt-1">📝 {customer.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">ID: {customer.id}</span>
                    <Link 
                      href={`/customers/${customer.id}/edit`}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Редактировать
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}