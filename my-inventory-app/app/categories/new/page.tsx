// app/categories/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

  // === Улучшенный выбор категорий ===
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // === Уведомления === - ПЕРЕМЕЩАЕМ В НАЧАЛО
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const [treeRes, flatRes] = await Promise.all([
        fetch("/api/categories/tree"),
        fetch("/api/categories")
      ]);
      
      const treeData = await treeRes.json();
      const flatData = await flatRes.json();
      
      if (treeData.ok) setCategories(treeData.data || []);
      if (flatData.ok) setFlatCategories(flatData.data || []);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    }
  };

  /** Показ уведомления */
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  /** Переключение раскрытия категории */
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  /** Выбор категории */
  const selectCategory = (categoryId: number | "") => {
    setParentId(categoryId);
    setShowCategoryModal(false);
    setSearchTerm("");
  };

  /** Рекурсивное отображение дерева категорий */
  const renderCategoryTree = (categories: Category[], level = 0) => {
    return categories.map(category => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedCategories.has(category.id);
      
      // Фильтрация по поиску
      const filteredChildren = category.children?.filter(child => 
        child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.path.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const showCategory = searchTerm === "" || 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (filteredChildren && filteredChildren.length > 0);

      if (!showCategory) return null;

      return (
        <div key={category.id} className="select-none">
          {/* Категория */}
          <div 
            className={`flex items-center py-2 px-3 hover:bg-gray-100 rounded cursor-pointer ${
              parentId === category.id ? 'bg-blue-50 border border-blue-200' : ''
            }`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
          >
            {/* Иконка раскрытия */}
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category.id);
                }}
                className="w-6 h-6 flex items-center justify-center mr-1 text-gray-500 hover:bg-gray-200 rounded"
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            
            {/* Заполнитель для категорий без детей */}
            {!hasChildren && <div className="w-6 h-6 mr-1"></div>}

            {/* Название категории */}
            <div 
              className="flex-1 flex items-center"
              onClick={() => selectCategory(category.id)}
            >
              <span className="text-lg mr-2">📁</span>
              <span className="flex-1">{category.name}</span>
              
              {/* Badge для корневой категории */}
              {level === 0 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
                  корень
                </span>
              )}
            </div>

            {/* Кнопка выбора */}
            <button
              onClick={() => selectCategory(category.id)}
              className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              Выбрать
            </button>
          </div>

          {/* Дочерние категории */}
          {hasChildren && isExpanded && (
            <div className="border-l-2 border-gray-200 ml-3">
              {renderCategoryTree(category.children || [], level + 1)}
            </div>
          )}
        </div>
      );
    }).filter(Boolean);
  };

  /** Отфильтрованные категории для поиска */
  const filteredCategories = searchTerm === "" 
    ? categories 
    : categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.children?.some(child => 
          child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.path.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

  /** Получить название выбранной категории */
  const getSelectedCategoryName = () => {
    if (!parentId) return "Не выбрана";
    
    const findCategory = (cats: Category[]): Category | null => {
      for (const cat of cats) {
        if (cat.id === parentId) return cat;
        if (cat.children) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const category = findCategory(categories);
    return category ? category.name : "Не выбрана";
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
          parentId: parentId || null,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setCategoryName("");
        setParentId("");
        
        // Перезагружаем категории
        await loadCategories();
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

      const data = await res.json();
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
    <div className="container mx-auto p-6 space-y-8 max-w-4xl">
      {/* Уведомление должно быть здесь, после объявления notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-fade-in z-50">
          {notification}
        </div>
      )}

      {/* Заголовок с кнопкой перехода к редактированию */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Создание категорий и спайнов</h1>
        
        {/* Кнопка перехода к редактированию категорий */}
        <Link
          href="/categories"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <span>✏️</span>
          <span>Редактировать категории</span>
        </Link>
      </div>

      {/* === Блок создания категории === */}
      <section className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Создать категорию</h2>
          <div className="text-sm text-gray-500">
            Всего категорий: {countAllCategories(categories)}
          </div>
        </div>
        
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Название категории</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Введите название категории"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Родительская категория</label>
            
            {/* Кнопка для открытия модального окна */}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex justify-between items-center">
                  <span className={parentId ? "text-gray-900" : "text-gray-500"}>
                    {getSelectedCategoryName()}
                  </span>
                  <span className="text-gray-400">▼</span>
                </div>
              </button>
              
              {parentId && (
                <button
                  type="button"
                  onClick={() => selectCategory("")}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            <p className="text-sm text-gray-600 mt-1">
              {parentId ? `Выбрана: ${getSelectedCategoryName()}` : "Категория будет создана в корне"}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
              disabled={loadingCategory}
            >
              {loadingCategory ? "Создание..." : "Создать категорию"}
            </button>

            <Link
              href="/categories"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
            >
              <span>📋</span>
              <span>Все категории</span>
            </Link>
          </div>
        </form>
      </section>

      {/* === Блок создания спайна === */}
      <section className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Создать спайн</h2>
        <form onSubmit={handleCreateSpine} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Название спайна</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={spineName}
              onChange={(e) => setSpineName(e.target.value)}
              placeholder="Введите название спайна"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Категория для спайна</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            disabled={loadingSpine}
          >
            {loadingSpine ? "Создание..." : "Создать спайн"}
          </button>
        </form>
      </section>

      {/* Модальное окно выбора категории */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Заголовок */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Выберите родительскую категорию</h3>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setSearchTerm("");
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Поиск */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Поиск категорий..."
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Список категорий */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Кнопка "Корневая категория" */}
              <div 
                className={`flex items-center py-3 px-3 hover:bg-gray-100 rounded cursor-pointer mb-2 ${
                  !parentId ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                onClick={() => selectCategory("")}
              >
                <span className="text-lg mr-2">🏠</span>
                <span className="flex-1 font-medium">Корневая категория</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  верхний уровень
                </span>
              </div>

              {/* Дерево категорий */}
              {renderCategoryTree(filteredCategories)}
              
              {filteredCategories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Категории не найдены
                </div>
              )}
            </div>

            {/* Футер */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setSearchTerm("");
                }}
                className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Закрыть
              </button>
            </div>
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