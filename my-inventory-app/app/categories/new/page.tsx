// app/categories/new/page.tsx
"use client";

import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  path: string;
  children?: Category[];
}

interface FlatCategory {
  id: number;
  name: string;
  path: string;
}

export default function CategoriesAndSpinesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([]);

  // === Категории ===
  const [categoryName, setCategoryName] = useState("");
  const [parentId, setParentId] = useState<number | "">("");
  const [loadingCategory, setLoadingCategory] = useState(false);

  // === Спайны ===
  const [spineName, setSpineName] = useState("");
  const [spineCategoryId, setSpineCategoryId] = useState<number | "">("");
  const [loadingSpine, setLoadingSpine] = useState(false);

  // === Уведомления ===
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Загружаем дерево категорий для селектора
    fetch("/api/categories/tree")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setCategories(data.data || []);
      });

    // Загружаем плоский список для спайнов
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setFlatCategories(data.data || []);
      });
  }, []);

  /** Показ уведомления */
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  /** Рекурсивная функция для отображения дерева категорий */
const renderCategoryOptions = (categories: Category[], level = 0): JSX.Element[] => {
  const options: JSX.Element[] = [];
  
  categories.forEach(category => {
    options.push(
      <option key={category.id} value={category.id}>
        {"\u00A0\u00A0".repeat(level)}📁 {category.name}
      </option>
    );
    
    if (category.children && category.children.length > 0) {
      options.push(...renderCategoryOptions(category.children, level + 1));
    }
  });
  
  return options;
};

  /** Создание категории */
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCategory(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName.trim(),
          parentId: parentId || null, // Оставляем parentId - API сам преобразует в path
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setCategoryName("");
        setParentId("");
        
        // Перезагружаем категории
        const [treeRes, flatRes] = await Promise.all([
          fetch("/api/categories/tree"),
          fetch("/api/categories")
        ]);
        
        const treeData = await treeRes.json();
        const flatData = await flatRes.json();
        
        if (treeData.ok) setCategories(treeData.data || []);
        if (flatData.ok) setFlatCategories(flatData.data || []);
        
        showNotification("Категория успешно создана!");
      } else {
        showNotification("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error(err);
      showNotification("Произошла ошибка при создании категории");
    } finally {
      setLoadingCategory(false);
    }
  };

  /** Создание спайна */
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

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Ошибка парсинга JSON:", err);
        showNotification("Сервер вернул неверный формат данных");
        return;
      }

      if (data.ok) {
        setSpineName("");
        setSpineCategoryId("");
        showNotification("Спайн успешно создан!");
      } else {
        showNotification("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error(err);
      showNotification("Произошла ошибка при создании спайна");
    } finally {
      setLoadingSpine(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Создание категорий и спайнов</h1>

      {notification && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {notification}
        </div>
      )}

      {/* === Блок создания категории === */}
      <section className="p-4 bg-white rounded-lg shadow-md max-w-md">
        <h2 className="text-xl font-semibold mb-3">Создать категорию</h2>
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block font-medium">Название категории</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Родительская категория</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={parentId}
              onChange={(e) => setParentId(Number(e.target.value) || "")}
            >
              <option value="">-- нет родителя (корневая) --</option>
              {renderCategoryOptions(categories)}
            </select>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loadingCategory}
          >
            {loadingCategory ? "Создание..." : "Создать категорию"}
          </button>
        </form>
      </section>

      {/* === Блок создания спайна === */}
      <section className="p-4 bg-white rounded-lg shadow-md max-w-md">
        <h2 className="text-xl font-semibold mb-3">Создать спайн</h2>
        <form onSubmit={handleCreateSpine} className="space-y-4">
          <div>
            <label className="block font-medium">Название спайна</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={spineName}
              onChange={(e) => setSpineName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Категория для спайна</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={spineCategoryId}
              onChange={(e) => setSpineCategoryId(Number(e.target.value) || "")}
              required
            >
              <option value="">-- выберите категорию --</option>
              {flatCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loadingSpine}
          >
            {loadingSpine ? "Создание..." : "Создать спайн"}
          </button>
        </form>
      </section>
    </div>
  );
}