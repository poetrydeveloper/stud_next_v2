// app/store/page.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import StoreSearch from "@/app/store/StoreSearch";
import SpineGrid from "@/app/store/SpineGrid";
import CategoryTree from "@/app/store/CategoryTree";
import CashDayPanel from "@/app/store/CashDayPanel";

interface Spine {
  id: number;
  name: string;
  slug: string;
  brandData?: any;
  productUnits?: ProductUnit[];
  _count?: {
    productUnits: number;
  };
}

interface ProductUnit {
  id: number;
  serialNumber: string;
  statusCard: string;
  statusProduct: string;
  productName?: string;
  productCode?: string;
  requestPricePerUnit?: number;
  salePrice?: number;
  soldAt?: string;
  isCredit?: boolean;
  customer?: {
    name: string;
    phone?: string;
  };
  product?: {
    name: string;
    code: string;
    brand?: {
      name: string;
    };
    images?: Array<{
      path: string;
      isMain: boolean;
    }>;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  path: string;
  children?: Category[];
}

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all"); // ← ИЗМЕНЕНО: "all" вместо "IN_STORE"
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [spines, setSpines] = useState<Spine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка категорий
  useEffect(() => {
    fetch("/api/categories/tree")
      .then(res => res.json())
      .then((data) => {
        if (data.ok) {
          setCategories(data.data || []);
        }
      })
      .catch((err) => {
        console.error("Ошибка при загрузке категорий:", err);
      });
  }, []);

  // Загрузка Spine с фильтрацией
  useEffect(() => {
    const loadSpines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ИСПРАВЛЕНО: используем /api/store и убираем параметры статуса
        const response = await fetch('/api/store');
        const data = await response.json();
        
        if (data.ok) {
          setSpines(data.data || []); // ← Обратите внимание: data.data, а не data.spines
        } else {
          setError(data.error || "Ошибка загрузки данных");
        }
      } catch (err: any) {
        setError(err.message || "Ошибка сети");
      } finally {
        setLoading(false);
      }
    };

    loadSpines();
  }, [selectedCategory]);

  // Фильтрация spines по поисковому запросу на клиенте
  const filteredSpines = useMemo(() => {
    if (!searchQuery) return spines;

    return spines.filter(spine => {
      const spineMatch = spine.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const unitsMatch = spine.productUnits?.some(unit => 
        unit.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.productCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.product?.code.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return spineMatch || unitsMatch;
    });
  }, [spines, searchQuery]);

  // Сбор всех брендов для фильтра
  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    spines.forEach(spine => {
      if (spine.brandData && typeof spine.brandData === 'object') {
        Object.keys(spine.brandData).forEach(brand => brands.add(brand));
      }
      spine.productUnits?.forEach(unit => {
        if (unit.product?.brand?.name) {
          brands.add(unit.product.brand.name);
        }
      });
    });
    return ["all", ...Array.from(brands)].sort();
  }, [spines]);

  // Обработчик выбора категории
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Левая панель - Дерево категорий */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-4">
          <CategoryTree 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        {/* Основной контент */}
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Заголовок */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🏪 Магазин - Товары на складе
              </h1>
              <p className="text-gray-600">
                {selectedCategory 
                  ? `Категория: ${categories.find(c => c.id === selectedCategory)?.name}`
                  : "Все категории"
                } • {spines.length} товарных групп
              </p>
            </div>

            {/* Умный поиск и фильтры */}
            <StoreSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              brands={allBrands}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />

            {/* Основной контент с сеткой товаров и кассовой панелью */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Сетка Spine карточек - 3 колонки */}
              <div className="lg:col-span-3">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Загрузка товаров...</p>
                  </div>
                ) : (
                  <SpineGrid 
                    spines={filteredSpines}
                    selectedBrand={selectedBrand}
                    selectedStatus={selectedStatus}
                  />
                )}
              </div>

              {/* Панель кассового дня - 1 колонка */}
              <div className="lg:col-span-1">
                <CashDayPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}