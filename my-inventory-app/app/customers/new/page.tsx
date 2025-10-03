// app/customers/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim() || undefined,
          notes: formData.notes.trim() || undefined,
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
      alert("Произошла ошибка при создании клиента");
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Создать клиента</h1>
      
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
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Создание..." : "Создать клиента"}
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