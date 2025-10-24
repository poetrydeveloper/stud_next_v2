// app/product-units/page.tsx
"use client";

import { useState, useEffect } from "react";
import CategoryTreeView from "@/app/product-units/components/unit/CategoryTreeView";

interface ProductUnit {
  id: number;
  serialNumber: string;
  statusCard: string;
  statusProduct?: string;
  productName?: string;
  productCode?: string;
  product?: {
    name: string;
    code: string;
    brand?: {
      name: string;
    };
    images?: Array<{
      path: string;
      isMain: boolean;
      localPath?: string;
    }>;
  };
}

interface SpineWithUnits {
  id: number;
  name: string;
  productUnits: ProductUnit[];
}

interface CategoryWithSpines {
  id: number;
  name: string;
  spines: SpineWithUnits[];
}

export default function ProductUnitsPage() {
  const [categories, setCategories] = useState<CategoryWithSpines[]>([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [candidateUnits, setCandidateUnits] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalSpines, setTotalSpines] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/product-units/page-data?cache=' + Date.now());
      const data = await response.json();

      if (data.ok) {
        setCategories(data.categories || []);
        setTotalUnits(data.totalUnits || 0);
        setCandidateUnits(data.candidateUnits || 0);
        setTotalCategories(data.totalCategories || 0);
        setTotalSpines(data.totalSpines || 0);
      } else {
        throw new Error(data.error || 'Failed to load data');
      }
    } catch (err: any) {
      console.error("Error loading product units:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnitStatusChange = async (unitId: number, newStatus: string) => {
    // Обновляем локальное состояние для мгновенного отклика
    const updatedCategories = categories.map(category => ({
      ...category,
      spines: category.spines.map(spine => ({
        ...spine,
        productUnits: spine.productUnits.map(unit => 
          unit.id === unitId ? { ...unit, statusCard: newStatus } : unit
        )
      }))
    }));
    
    setCategories(updatedCategories);
    
    // Пересчитываем статистику
    const allUnits = updatedCategories.flatMap(cat => 
      cat.spines.flatMap(spine => spine.productUnits)
    );
    
    setTotalUnits(allUnits.length);
    setCandidateUnits(allUnits.filter(u => u.statusCard === "CANDIDATE").length);
    
    // Фоновая перезагрузка для синхронизации с сервером
    setTimeout(() => {
      loadData();
    }, 500);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Загрузка...</h1>
          <p className="text-gray-600">Загружаем дерево категорий</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={loadData} 
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Товарные единицы</h1>
              <p className="text-gray-600">Дерево категорий с группировкой по Spine</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="text-sm text-gray-600">Категории: <span className="font-semibold">{totalCategories}</span></div>
              <div className="text-sm text-gray-600">Spine: <span className="font-semibold">{totalSpines}</span></div>
              <div className="text-sm text-gray-600">Всего: <span className="font-semibold">{totalUnits}</span></div>
              <div className="text-sm text-gray-600">Кандидатов: <span className="font-semibold text-yellow-600">{candidateUnits}</span></div>
              <button 
                onClick={loadData}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                title="Обновить данные"
              >
                🔄
              </button>
            </div>
          </div>
        </div>

        <CategoryTreeView 
          categories={categories} 
          onUnitStatusChange={handleUnitStatusChange}
        />
        
        {categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-4xl mb-4">🌳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет категорий</h3>
            <p className="text-gray-500 mb-4">Создайте категории и Spine чтобы начать работу</p>
          </div>
        )}
      </div>
    </div>
  );
}