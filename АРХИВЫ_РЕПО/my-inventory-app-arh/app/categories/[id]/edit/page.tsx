// app/categories/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  path: string;
}

interface FlatCategory {
  id: number;
  name: string;
  path: string;
}

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([]);
  
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId) {
      loadCategoryData();
    }
  }, [categoryId]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      
      const [categoryRes, treeRes, flatRes] = await Promise.all([
        fetch(`/api/categories/${categoryId}`),
        fetch("/api/categories/tree"),
        fetch("/api/categories")
      ]);

      const categoryData = await categoryRes.json();
      const treeData = await treeRes.json();
      const flatData = await flatRes.json();

      console.log("📥 Данные категории:", categoryData);
      console.log("📥 Дерево категорий:", treeData);
      console.log("📥 Плоский список:", flatData);

      if (categoryData.ok) {
        setCategory(categoryData.data);
        setName(categoryData.data.name);
        
        // Устанавливаем parentId на основе path
        const pathParts = categoryData.data.path.split('/').filter(Boolean);
        if (pathParts.length > 1) {
          // Ищем родительскую категорию по path
          const parentPath = '/' + pathParts.slice(0, -1).join('/');
          const parentCategory = flatData.data.find((c: FlatCategory) => c.path === parentPath);
          if (parentCategory) {
            setParentId(parentCategory.id);
          }
        }
      } else {
        console.error("❌ Ошибка загрузки категории:", categoryData.error);
      }

      if (treeData.ok) setCategories(treeData.data || []);
      if (flatData.ok) setFlatCategories(flatData.data || []);

    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      showNotification("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          parentId: parentId || null,
        }),
      });

      const data = await response.json();
      
      if (data.ok) {
        showNotification("Категория успешно обновлена!");
        router.push("/categories");
      } else {
        showNotification("Ошибка: " + data.error);
      }
    } catch (error) {
      console.error("Ошибка обновления категории:", error);
      showNotification("Произошла ошибка при обновлении категории");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены что хотите удалить эту категорию?")) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      
      if (data.ok) {
        showNotification("Категория успешно удалена!");
        router.push("/categories");
      } else {
        showNotification("Ошибка: " + data.error);
      }
    } catch (error) {
      console.error("Ошибка удаления категории:", error);
      showNotification("Произошла ошибка при удалении категории");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Категория не найдена</h2>
        <p className="text-gray-600 mb-4">ID: {categoryId}</p>
        <Link
          href="/categories"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Назад к категориям
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      {notification && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-fade-in z-50">
          {notification}
        </div>
      )}

      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/categories"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Назад к категориям
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Редактировать категорию</h1>
        </div>
        
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          🗑️ Удалить
        </button>
      </div>

      {/* Форма редактирования */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2">Название категории</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название категории"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Родительская категория</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={parentId}
              onChange={(e) => setParentId(Number(e.target.value) || "")}
            >
              <option value="">-- нет родителя (корневая) --</option>
              {flatCategories
                .filter(cat => cat.id !== category.id) // Исключаем текущую категорию
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              }
            </select>
            <p className="text-sm text-gray-600 mt-1">
              Текущий путь: {category.path}
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Сохранение..." : "💾 Сохранить"}
            </button>
            
            <Link
              href="/categories"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Отмена
            </Link>
          </div>
        </form>
      </div>

      {/* Информация о категории */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h3 className="font-medium mb-2">Информация о категории:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>ID:</strong> {category.id}</p>
          <p><strong>Slug:</strong> {category.slug}</p>
          <p><strong>Path:</strong> {category.path}</p>
          {/* Убрали строку с children так как этого поля нет */}
        </div>
      </div>
    </div>
  );
}