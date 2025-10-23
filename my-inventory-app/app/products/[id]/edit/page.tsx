// app/products/[id]/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}
interface Brand {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  code: string;
  description?: string;
  categoryId?: number;
  brandId?: number;
  images?: { id: number; path: string; filename: string; isMain: boolean }[];
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [brandId, setBrandId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [deleteImages, setDeleteImages] = useState<number[]>([]);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setProduct(data.data);
          setName(data.data.name);
          setCode(data.data.code);
          setDescription(data.data.description || "");
          setCategoryId(data.data.categoryId || "");
          setBrandId(data.data.brandId || "");
        }
      });

    fetch("/api/categories/tree")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));

    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data.data || []));
  }, [params.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const toggleDeleteImage = (id: number) => {
    setDeleteImages((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("code", code);
      formData.append("description", description);
      if (categoryId) formData.append("categoryId", String(categoryId));
      if (brandId) formData.append("brandId", String(brandId));
      deleteImages.forEach((id) => formData.append("deleteImages", String(id)));
      images.forEach((file) => formData.append("images", file));

      const res = await fetch(`/api/products/${params.id}`, {
        method: "PATCH",
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

  if (!product) return <div>Загрузка...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Редактировать продукт</h1>
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

        <div>
          <label className="block font-medium">Категория</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value) || "")}
          >
            <option value="">-- выберите --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
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
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Существующие изображения */}
        {product.images && product.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {product.images.map((img) => (
              <div key={img.id} className="relative">
                <img
                  src={img.path}
                  alt={img.filename}
                  className="w-20 h-20 object-cover border rounded"
                />
                <button
                  type="button"
                  onClick={() => toggleDeleteImage(img.id)}
                  className={`absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs ${
                    deleteImages.includes(img.id) ? "line-through" : ""
                  }`}
                  title="Удалить изображение"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Новые изображения */}
        <div>
          <label className="block font-medium">Добавить изображения</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          disabled={loading}
        >
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
