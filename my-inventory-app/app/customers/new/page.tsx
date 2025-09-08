// app/customers/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCustomerPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/customers/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Покупатель успешно создан!");
        setTimeout(() => {
          router.push("/customers");
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || "Ошибка при создании покупателя"}`);
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
      <h1 className="text-2xl font-bold mb-6">Создать покупателя</h1>

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
        {/* Имя */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-medium">
            Имя покупателя <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Иван Иванов"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Телефон */}
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="font-medium">
            Телефон <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="+7 900 123-45-67"
            value={formData.phone}
            onChange={handleChange}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@mail.ru"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
          />
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 p-3 rounded-lg text-white font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Сохранение..." : "Создать"}
        </button>
      </form>
    </div>
  );
}
