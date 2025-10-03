// app/spines/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface Spine {
  id: number;
  name: string;
  slug: string;
  categoryId: number | null;
  imagePath: string | null;
}

export default function EditSpinePage() {
  const router = useRouter();
  const params = useParams();
  const spineId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "" as string | number,
    imagePath: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // Загружаем категории и данные Spine параллельно
    Promise.all([
      fetch("/api/categories").then(res => res.json()),
      fetch(`/api/spines/${spineId}`).then(res => res.json())
    ]).then(([categoriesData, spineData]) => {
      if (categoriesData.ok) setCategories(categoriesData.data || []);
      
      if (spineData) {
        setFormData({
          name: spineData.name || "",
          slug: spineData.slug || "",
          categoryId: spineData.categoryId || "",
          imagePath: spineData.imagePath || ""
        });
      }
      setFetching(false);
    }).catch(err => {
      console.error("Ошибка загрузки:", err);
      setFetching(false);
    });
  }, [spineId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/spines/${spineId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          categoryId: formData.categoryId ? Number(formData.categoryId) : null,
          imagePath: formData.imagePath.trim() || null,
        }),
      });

      const data = await res.json();

      if (data) {
        router.push(`/spines/${spineId}`);
      } else {
        alert("Ошибка при обновлении Spine");
      }
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка при обновлении Spine");
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
        <p className="text-gray-500">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Редактировать Spine</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block font-medium mb-1">Название Spine *</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Slug *</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            required
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
          
          <button
            type="button"
            onClick={() => router.push(`/spines/${spineId}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}