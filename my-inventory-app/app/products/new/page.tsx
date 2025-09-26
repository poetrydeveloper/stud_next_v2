// app/products/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  parentId: number | null;
}

interface Spine {
  id: number;
  name: string;
  slug: string;
}

interface Brand {
  id: number;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">(""); // ← исправлено: categoryId вместо spineId
  const [spineId, setSpineId] = useState<number | "">("");
  const [brandId, setBrandId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]); // ← исправлено: categories вместо spines
  const [spines, setSpines] = useState<Spine[]>([]); // ← отдельно spines
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSpines, setLoadingSpines] = useState(false);

  useEffect(() => {
    // Загружаем категории (а не spines)
    fetch("/api/categories/tree")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));

    // Загружаем бренды
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data.data || []));
  }, []);

  // Загружаем spines при изменении категории
  useEffect(() => {
    if (categoryId) {
      setLoadingSpines(true);
      fetch(`/api/spines/category/${categoryId}`)
        .then((res) => res.json())
        .then((data) => {
          setSpines(data.data || []);
          setSpineId(""); // Сбрасываем выбор spine при смене категории
        })
        .catch((error) => {
          console.error("Error loading spines:", error);
          setSpines([]);
        })
        .finally(() => setLoadingSpines(false));
    } else {
      setSpines([]);
      setSpineId("");
    }
  }, [categoryId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  // Рекурсивная функция для отображения дерева категорий в <option>
  const renderCategoryOptions = (nodes: Category[], depth = 0): JSX.Element[] => {
    const options: JSX.Element[] = [];
    
    nodes.forEach((node) => {
      options.push(
        <option key={node.id} value={node.id}>
          {Array(depth).fill("— ").join("")}{node.name}
        </option>
      );
    });
    
    return options;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("code", code);
      formData.append("description", description);
      formData.append("categoryId", String(categoryId)); // ← исправлено: передаем categoryId
      if (spineId) formData.append("spineId", String(spineId));
      if (brandId) formData.append("brandId", String(brandId));
      images.forEach((file) => formData.append("images", file));

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.ok) {
        router.push("/products");
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Создать продукт</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block font-medium">Название</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Код</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Описание</label>
          <textarea
            className="w-full border rounded px-2 py-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Исправлено: сначала выбираем категорию */}
        <div>
          <label className="block font-medium">Категория</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value) || "")}
            required
          >
            <option value="">-- выберите категорию --</option>
            {renderCategoryOptions(categories)}
          </select>
        </div>

        {/* Исправлено: затем выбираем spine для выбранной категории */}
        <div>
          <label className="block font-medium">Spine (тип продукции)</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={spineId}
            onChange={(e) => setSpineId(Number(e.target.value) || "")}
            disabled={!categoryId || loadingSpines}
          >
            <option value="">-- выберите spine --</option>
            {loadingSpines ? (
              <option>Загрузка spines...</option>
            ) : (
              spines.map((spine) => (
                <option key={spine.id} value={spine.id}>
                  {spine.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block font-medium">Бренд</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={brandId}
            onChange={(e) => setBrandId(Number(e.target.value) || "")}
          >
            <option value="">-- выберите --</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Изображения</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Создание..." : "Создать продукт"}
        </button>
      </form>
    </div>
  );
}