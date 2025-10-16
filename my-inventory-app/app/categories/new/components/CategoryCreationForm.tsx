// app/categories/new/components/CategoryCreationForm.tsx
"use client";

import { useState } from "react";
import CategoryTreeModal from "./CategoryTreeModal";
import type { CategoryNode, FlatCategory } from "../page";

interface CategoryCreationFormProps {
  categoriesTree: CategoryNode[];
  flatCategories: FlatCategory[];
  onCategoryCreated: () => void;
  onNotification: (message: string) => void;
}

export default function CategoryCreationForm({
  categoriesTree,
  onCategoryCreated,
  onNotification
}: CategoryCreationFormProps) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | "">("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastCreatedCategoryId, setLastCreatedCategoryId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          parentId: parentId || null,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setName("");
        setParentId("");
        setLastCreatedCategoryId(data.data?.id ?? null);
        onCategoryCreated();
        onNotification("Категория успешно создана");
      } else {
        onNotification("Ошибка: " + (data.error || "Неизвестная ошибка"));
      }
    } catch (err) {
      console.error(err);
      onNotification("Произошла ошибка при создании категории");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Создать категорию</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              onClick={() => setModalOpen(true)}
            >
              {parentId ? "Изменить" : "Выбрать категорию"}
            </button>

            <div className="text-sm text-gray-700">
              {parentId ? `Выбрана категория ID: ${parentId}` : "Корневая категория"}
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            {loading ? "Создание..." : "Создать категорию"}
          </button>
        </div>
      </form>

      <CategoryTreeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(id) => {
          setParentId(id);
          setModalOpen(false);
        }}
        categories={categoriesTree}
        selectedCategoryId={parentId}
        lastCreatedCategoryId={lastCreatedCategoryId}
      />
    </section>
  );
}
