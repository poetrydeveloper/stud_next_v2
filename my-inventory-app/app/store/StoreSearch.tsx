// app/store/StoreSearch.tsx (обновленная версия)
"use client";

interface StoreSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export default function StoreSearch({
  searchQuery,
  onSearchChange,
  brands,
  selectedBrand,
  onBrandChange,
  selectedStatus,
  onStatusChange
}: StoreSearchProps) {
  const statusOptions = [
    { value: "IN_STORE", label: "📦 На складе", description: "Доступные для продажи" },
    { value: "SOLD", label: "✅ Продано", description: "Проданные товары" },
    { value: "CREDIT", label: "💳 В кредите", description: "Отданные в кредит" },
    { value: "all", label: "📊 Все статусы", description: "Показать все товары" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Поиск по названию и артикулу */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Поиск товаров в магазине
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Название, артикул, серийный номер..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Поиск по всем товарам на складе
          </p>
        </div>

        {/* Фильтр по брендам */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏷️ Бренд
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">Все бренды</option>
            {brands.filter(brand => brand !== "all").map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Фильтр по статусам */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📊 Статус товара
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {statusOptions.find(opt => opt.value === selectedStatus)?.description}
          </p>
        </div>

      </div>

      {/* Быстрые подсказки поиска */}
      {searchQuery && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            <strong>Поиск:</strong> "{searchQuery}"
          </div>
          <div className="text-xs text-blue-600 mt-1">
            • Название товара • Артикул • Серийный номер • Бренд
          </div>
        </div>
      )}

      {/* Информация о фильтрах */}
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedStatus !== "all" && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {statusOptions.find(opt => opt.value === selectedStatus)?.label}
          </span>
        )}
        {selectedBrand !== "all" && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            🏷️ {selectedBrand}
          </span>
        )}
        {searchQuery && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            🔍 "{searchQuery}"
          </span>
        )}
      </div>
    </div>
  );
}