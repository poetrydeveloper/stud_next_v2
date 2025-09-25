"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  children?: Category[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
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

  // Строим дерево категорий
  const buildTree = (items: Category[], parentId: number | null = null): Category[] => {
    return items
      .filter((c) => c.parentId === parentId)
      .map((c) => ({
        ...c,
        children: buildTree(items, c.id),
      }));
  };

  const tree = buildTree(categories);

  const renderTree = (nodes: Category[]) => (
    <ul className="pl-4">
      {nodes.map((node) => (
        <li key={node.id} className="mb-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{node.name}</span>
            <span className="text-xs text-gray-500">({node.slug})</span>
          </div>
          {node.children && node.children.length > 0 && renderTree(node.children)}
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
          renderTree(tree)
        )}
      </div>
    </div>
  );
}
