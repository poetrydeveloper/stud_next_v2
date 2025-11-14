// app/categories/new/components/CategoryTreeModal.tsx
"use client";

import { useState, useMemo } from "react";
import CategoryTreeNode from "./CategoryTreeNode";

interface Category {
  id: number;
  name: string;
  path: string;
  children?: Category[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoryId: number | "") => void;
  categories: Category[]; // уже дерево
  selectedCategoryId: number | "";
  lastCreatedCategoryId: number | null;
}

export default function CategoryTreeModal({
  isOpen,
  onClose,
  onSelect,
  categories,
  selectedCategoryId,
  lastCreatedCategoryId
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const s = searchTerm.trim().toLowerCase();

    // рекурсивная фильтрация: возвращает node или null
    const filterNode = (node: Category): Category | null => {
      const matchSelf =
        node.name.toLowerCase().includes(s) ||
        node.path.toLowerCase().includes(s);

      const childrenFiltered = (node.children || [])
        .map(filterNode)
        .filter(Boolean) as Category[];

      if (matchSelf || childrenFiltered.length) {
        return {
          ...node,
          children: childrenFiltered
        };
      }

      return null;
    };

    return categories
      .map(filterNode)
      .filter(Boolean) as Category[];
  }, [searchTerm, categories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Выберите родительскую категорию</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder="Поиск категорий..."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {lastCreatedCategoryId && (
            <div className="mt-2 text-sm text-red-600 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Новая созданная категория подсвечена
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div
            className={`flex items-center py-3 px-3 hover:bg-gray-100 rounded cursor-pointer mb-2 ${
              selectedCategoryId === "" ? "bg-blue-50 border border-blue-200" : ""
            }`}
            onClick={() => onSelect("")}
          >
            <span className="text-lg mr-2">🏠</span>
            <span className="flex-1 font-medium">Корневая категория</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              верхний уровень
            </span>
          </div>

          {filtered.length === 0 && (
            <div className="text-sm text-gray-500">Ничего не найдено</div>
          )}

          {filtered.map((cat) => (
            <CategoryTreeNode
              key={cat.id}
              category={cat}
              level={0}
              searchTerm={searchTerm}
              selectedCategoryId={selectedCategoryId}
              lastCreatedCategoryId={lastCreatedCategoryId}
              onSelect={onSelect}
            />
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
