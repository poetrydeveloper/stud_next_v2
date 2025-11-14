// app/categories/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CategoryCreationForm from "./components/CategoryCreationForm";
import SpineCreationForm from "./components/SpineCreationForm";
import Notification from "./components/Notification";
import { CategoryNode as SuperAddCategoryNode } from "@/app/types/super-add";

export interface FlatCategory {
  id: number;
  name: string;
  slug: string;
  path: string;
  node_index?: string;
  human_path?: string;
  parent_id?: number | null;
}

export interface CategoryNode extends FlatCategory {
  children?: CategoryNode[];
  spines?: any[]; // Добавляем spines для совместимости с SUPER_ADD
}

export default function CategoriesAndSpinesPage() {
  const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([]);
  const [categoriesTree, setCategoriesTree] = useState<CategoryNode[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      // Используем новый API для дерева с node_index
      const res = await fetch("/api/categories/tree");
      const data = await res.json();
      
      if (data.ok && Array.isArray(data.data)) {
        const treeData: CategoryNode[] = data.data;
        setCategoriesTree(treeData);
        
        // Также загружаем плоский список для совместимости
        const flatRes = await fetch("/api/categories");
        const flatData = await flatRes.json();
        if (flatData.ok) {
          setFlatCategories(flatData.data || []);
        }
      } else {
        console.error("Неправильный ответ /api/categories/tree:", data);
        // Fallback: загружаем старый API
        await loadFlatCategoriesFallback();
      }
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
      await loadFlatCategoriesFallback();
    } finally {
      setLoading(false);
    }
  };

  const loadFlatCategoriesFallback = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.ok && Array.isArray(data.data)) {
        const flats: FlatCategory[] = data.data;
        setFlatCategories(flats);
        setCategoriesTree(buildCategoryTree(flats));
      }
    } catch (error) {
      console.error("Fallback loading failed:", error);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Функция для преобразования в формат SUPER_ADD
  const convertToSuperAddFormat = (tree: CategoryNode[]): SuperAddCategoryNode[] => {
    return tree.map(node => ({
      id: node.id,
      name: node.name,
      slug: node.slug,
      path: node.path,
      node_index: node.node_index,
      human_path: node.human_path,
      parent_id: node.parent_id,
      children: node.children ? convertToSuperAddFormat(node.children) : undefined,
      spines: node.spines || []
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Загрузка категорий...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-4xl">
      <Notification message={notification} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Создание категорий и спайнов</h1>
          <p className="text-gray-600 mt-1">
            Используется система Node Index для иерархии
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/super-add"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <span>🚀</span>
            <span>SUPER ADD</span>
          </Link>
          
          <Link
            href="/categories"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <span>✏️</span>
            <span>Редактировать категории</span>
          </Link>
        </div>
      </div>

      {/* Статистика по node_index */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Информация о системе</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-600">Категорий:</span>
            <span className="ml-2 font-medium">{flatCategories.length}</span>
          </div>
          <div>
            <span className="text-blue-600">С node_index:</span>
            <span className="ml-2 font-medium">
              {flatCategories.filter(c => c.node_index).length}
            </span>
          </div>
          <div>
            <span className="text-blue-600">Корневых:</span>
            <span className="ml-2 font-medium">
              {categoriesTree.length}
            </span>
          </div>
          <div>
            <span className="text-blue-600">Глубина:</span>
            <span className="ml-2 font-medium">
              {Math.max(...flatCategories.map(c => (c.node_index || '').split('_').length - 1), 0)}
            </span>
          </div>
        </div>
      </div>

      <CategoryCreationForm
        categoriesTree={convertToSuperAddFormat(categoriesTree)}
        flatCategories={flatCategories}
        onCategoryCreated={loadCategories}
        onNotification={showNotification}
      />

      <SpineCreationForm
        flatCategories={flatCategories}
        onNotification={showNotification}
        onSpineCreated={loadCategories}
      />

      {/* Отладочная информация (можно убрать в production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Отладочная информация</h3>
          <details>
            <summary className="cursor-pointer text-sm text-gray-600">
              Показать дерево категорий ({categoriesTree.length} корневых)
            </summary>
            <pre className="text-xs mt-2 p-2 bg-white rounded border max-h-60 overflow-auto">
              {JSON.stringify(categoriesTree, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

/**
 * Построить дерево на основе materialized path (path = "/a/b/c")
 * Fallback функция для старых данных
 */
function buildCategoryTree(flat: FlatCategory[]): CategoryNode[] {
  if (!Array.isArray(flat)) return [];

  // Создаём карту по path для быстрого доступа
  const map = new Map<string, CategoryNode>();
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