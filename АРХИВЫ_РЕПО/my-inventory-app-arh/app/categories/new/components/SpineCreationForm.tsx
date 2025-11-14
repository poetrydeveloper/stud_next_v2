// app/categories/new/components/SpineCreationForm.tsx
"use client";

import { useState } from "react";

interface FlatCategory {
  id: number;
  name: string;
  path: string;
}

interface SpineCreationFormProps {
  flatCategories: FlatCategory[];
  onNotification: (message: string) => void;
}

export default function SpineCreationForm({
  flatCategories,
  onNotification
}: SpineCreationFormProps) {
  const [spineName, setSpineName] = useState("");
  const [spineCategoryId, setSpineCategoryId] = useState<number | "">("");
  const [loadingSpine, setLoadingSpine] = useState(false);

  const handleCreateSpine = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSpine(true);

    try {
      const res = await fetch("/api/spines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: spineName.trim(),
          categoryId: spineCategoryId || null,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setSpineName("");
        setSpineCategoryId("");
        onNotification("Спайн успешно создан!");
      } else {
        onNotification("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error(err);
      onNotification("Произошла ошибка при создании спайна");
    } finally {
      setLoadingSpine(false);
    }
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Создать спайн</h2>
      <form onSubmit={handleCreateSpine} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Название спайна</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={spineName}
            onChange={(e) => setSpineName(e.target.value)}
            placeholder="Введите название спайна"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Категория для спайна</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={spineCategoryId}
            onChange={(e) => setSpineCategoryId(Number(e.target.value) || "")}
            required
          >
            <option value="">-- выберите категорию --</option>
            {flatCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.path}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
          disabled={loadingSpine}
        >
          {loadingSpine ? "Создание..." : "Создать спайн"}
        </button>
      </form>
    </section>
  );
}
