// app/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  path: string;
  children?: Category[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories/tree") // Используем tree endpoint который возвращает готовое дерево
      .then(res => res.json())
      .then((data) => {
        setCategories(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке категорий:", err);
        setLoading(false);
      });
  }, []);

  const renderTree = (nodes: Category[], level = 0) => (
    <ul className="pl-4">
      {nodes.map((node) => (
        <li key={node.id} className="mb-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{node.name}</span>
            <span className="text-xs text-gray-500">({node.slug})</span>
            <span className="text-xs text-gray-400">path: {node.path}</span>
          </div>
          {node.children && node.children.length > 0 && renderTree(node.children, level + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Категории</h1>

      <Link
        href="/categories/new"
        className="mb-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Создать категорию
      </Link>

      <div className="bg-white rounded shadow p-4 border">
        {loading ? (
          <p className="text-gray-500">Загрузка категорий...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">Категории пока не созданы</p>
        ) : (
          renderTree(categories)
        )}
      </div>
    </div>
  );
}