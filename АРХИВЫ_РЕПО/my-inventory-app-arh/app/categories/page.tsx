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
    fetch("/api/categories/tree")
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

  const handleDelete = async (categoryId: number, categoryName: string) => {
    if (!confirm(`Вы уверены что хотите удалить категорию "${categoryName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      
      if (data.ok) {
        alert("Категория успешно удалена!");
        // Перезагружаем список
        const response = await fetch("/api/categories/tree");
        const newData = await response.json();
        setCategories(newData.data || []);
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (error) {
      console.error("Ошибка удаления категории:", error);
      alert("Произошла ошибка при удалении категории");
    }
  };

  const renderTree = (nodes: Category[], level = 0) => (
    <ul className="pl-4">
      {nodes.map((node) => (
        <li key={node.id} className="mb-2 p-2 hover:bg-gray-50 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Отступ для вложенности */}
              <div style={{ width: `${level * 20}px` }}></div>
              <span className="text-lg">📁</span>
              <div>
                <div className="font-medium text-gray-900">{node.name}</div>
                <div className="text-xs text-gray-500 flex space-x-2">
                  <span>slug: {node.slug}</span>
                  <span>path: {node.path}</span>
                </div>
              </div>
            </div>
            
            {/* Кнопки действий */}
            <div className="flex items-center space-x-2">
              <Link
                href={`/categories/${node.id}/edit`}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                ✏️ Редактировать
              </Link>
              
              <button
                onClick={() => handleDelete(node.id, node.name)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
          
          {/* Дочерние категории */}
          {node.children && node.children.length > 0 && renderTree(node.children, level + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Категории</h1>

      <div className="flex space-x-4 mb-6">
        <Link
          href="/categories/new"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          ➕ Создать категорию
        </Link>
        
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          🔄 Обновить
        </button>
      </div>

      <div className="bg-white rounded shadow p-4 border">
        {loading ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <span>Загрузка категорий...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-gray-500 mb-4">Категории пока не созданы</p>
            <Link
              href="/categories/new"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Создать первую категорию
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            {renderTree(categories)}
          </div>
        )}
      </div>

      {/* Статистика */}
      {categories.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">📊 Статистика категорий</h3>
          <div className="text-sm text-blue-800">
            Всего категорий: <strong>{countAllCategories(categories)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

// Вспомогательная функция для подсчета всех категорий
function countAllCategories(categories: Category[]): number {
  let count = 0;
  
  function countRecursive(cats: Category[]) {
    cats.forEach(cat => {
      count++;
      if (cat.children && cat.children.length > 0) {
        countRecursive(cat.children);
      }
    });
  }
  
  countRecursive(categories);
  return count;
}