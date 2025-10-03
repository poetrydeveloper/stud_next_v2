// app/customers/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Customer {
  id: number;
  name: string;
  phone: string | null;
  notes: string | null;
}

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (customerId) {
      fetch(`/api/customers/${customerId}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            const customer = data.data;
            setFormData({
              name: customer.name || "",
              phone: customer.phone || "",
              notes: customer.notes || ""
            });
          }
          setFetching(false);
        })
        .catch(err => {
          console.error("Ошибка при загрузке клиента:", err);
          setFetching(false);
        });
    }
  }, [customerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim() || null,
          notes: formData.notes.trim() || null,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        router.push("/customers");
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка при обновлении клиента");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (fetching) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-500">Загрузка данных клиента...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Редактировать клиента</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block font-medium mb-1">Имя клиента *</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Телефон</label>
          <input
            type="tel"
            className="w-full border rounded px-3 py-2"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+7 (XXX) XXX-XX-XX"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Примечания</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Дополнительная информация о клиенте..."
          />
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
          
          <Link
            href="/customers"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}