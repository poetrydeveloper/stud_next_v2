// app/categories/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CategoryCreationForm from "./components/CategoryCreationForm";
import SpineCreationForm from "./components/SpineCreationForm";
import Notification from "./components/Notification";

export interface FlatCategory {
  id: number;
  name: string;
  slug: string;
  path: string;
}

export interface CategoryNode extends FlatCategory {
  children?: CategoryNode[];
}

export default function CategoriesAndSpinesPage() {
  const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([]);
  const [categoriesTree, setCategoriesTree] = useState<CategoryNode[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.ok && Array.isArray(data.data)) {
        const flats: FlatCategory[] = data.data;
        setFlatCategories(flats);
        setCategoriesTree(buildCategoryTree(flats));
      } else {
        console.error("Неправильный ответ /api/categories:", data);
      }
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-4xl">
      <Notification message={notification} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Создание категорий и спайнов</h1>

        <Link
          href="/categories"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <span>✏️</span>
          <span>Редактировать категории</span>
        </Link>
      </div>

      <CategoryCreationForm
        categoriesTree={categoriesTree}
        flatCategories={flatCategories}
        onCategoryCreated={loadCategories}
        onNotification={showNotification}
      />

      <SpineCreationForm
        flatCategories={flatCategories}
        onNotification={showNotification}
      />
    </div>
  );
}

/**
 * Построить дерево на основе materialized path (path = "/a/b/c")
 * Возвращает массив корней с вложенными children.
 */
function buildCategoryTree(flat: FlatCategory[]): CategoryNode[] {
  if (!Array.isArray(flat)) return [];

  // Создаём карту по path для быстрого доступа
  const map = new Map<string, CategoryNode>();
  // Также массив корней
  const roots: CategoryNode[] = [];

  // Копируем элементы и подготовим children
  for (const c of flat) {
    map.set(c.path, { ...c, children: [] });
  }

  // Отсортируем по глубине пути — чтобы родитель встречался раньше детей
  const sorted = [...flat].sort((a, b) => {
    const da = a.path.split("/").filter(Boolean).length;
    const db = b.path.split("/").filter(Boolean).length;
    return da - db;
  });

  for (const c of sorted) {
    const node = map.get(c.path)!;
    // вычислим parentPath: всё до последнего сегмента
    const segments = c.path.split("/").filter(Boolean);
    if (segments.length <= 1) {
      // корень
      roots.push(node);
    } else {
      const parentSegments = segments.slice(0, -1);
      const parentPath = "/" + parentSegments.join("/");
      const parentNode = map.get(parentPath);
      if (parentNode) {
        parentNode.children = parentNode.children || [];
        parentNode.children.push(node);
      } else {
        // защитный случай: если родителя нет — поместим в корни
        roots.push(node);
      }
    }
  }

  return roots;
}
