// app/spines/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  path: string;
}

export default function NewSpinePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "" as string | number,
    imagePath: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data.ok) setCategories(data.data || []);
        setFetching(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки категорий:", err);
        setFetching(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/spines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          categoryId: formData.categoryId ? Number(formData.categoryId) : null,
          imagePath: formData.imagePath.trim() || null,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        router.push("/spines");
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка при создании Spine");
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
        <p className="text-gray-500">Загрузка категорий...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Создать Spine</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block font-medium mb-1">Название Spine *</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            placeholder="Например: Комбинированные ключи 10мм"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Категория</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={formData.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
          >
            <option value="">-- без категории --</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Путь к изображению</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.imagePath}
            onChange={(e) => handleChange("imagePath", e.target.value)}
            placeholder="/images/spines/key-10mm.jpg"
          />
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Создание..." : "Создать Spine"}
          </button>
          
          <button
            type="button"
            onClick={() => router.push("/spines")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}