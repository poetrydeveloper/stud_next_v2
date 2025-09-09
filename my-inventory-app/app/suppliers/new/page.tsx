// app/suppliers/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewSupplierPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Поставщик успешно создан!");
        setTimeout(() => {
          router.push("/suppliers");
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || "Ошибка при создании поставщика"}`);
      }
    } catch (error) {
      setMessage("❌ Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/suppliers" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Назад к списку поставщиков
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Создать поставщика</h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-sm font-medium ${
            message.includes("✅")
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 border"
      >
        {/* Имя поставщика */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-medium">
            Имя поставщика <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="ООО Ромашка"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
            disabled={loading}
          />
        </div>

        {/* Контактное лицо */}
        <div className="flex flex-col gap-1">
          <label htmlFor="contactPerson" className="font-medium">
            Контактное лицо
          </label>
          <input
            id="contactPerson"
            name="contactPerson"
            type="text"
            placeholder="Иван Иванов"
            value={formData.contactPerson}
            onChange={handleChange}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={loading}
          />
        </div>

        {/* Телефон */}
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="font-medium">
            Телефон
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="+7 900 123-45-67"
            value={formData.phone}
            onChange={handleChange}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={loading}
          />
        </div>

        {/* Заметки */}
        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="font-medium">
            Заметки
          </label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Дополнительная информация"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            disabled={loading}
          />
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`p-3 rounded-lg text-white font-medium transition flex-1 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Сохранение..." : "Создать поставщика"}
          </button>
          
          <Link
            href="/suppliers"
            className="p-3 rounded-lg border border-gray-300 text-gray-700 font-medium transition hover:bg-gray-50 text-center"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}