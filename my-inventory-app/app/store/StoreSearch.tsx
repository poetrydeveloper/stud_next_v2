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
  // Все возможные статусы для фильтрации
  const statusOptions = [
    { value: "all", label: "📊 Все статусы", description: "Показать все товары" },
    { value: "IN_STORE", label: "🏪 На складе", description: "Доступные для продажи" },
    { value: "CLEAR", label: "🔵 CLEAR", description: "Готовы к работе" },
    { value: "IN_REQUEST", label: "📋 В заявке", description: "Заказанные товары" },
    { value: "IN_DELIVERY", label: "🚚 В доставке", description: "В процессе доставки" },
    { value: "ARRIVED", label: "✅ Прибыл", description: "Недавно прибывшие" },
    { value: "IN_DISASSEMBLED", label: "🔧 Разобран", description: "Разобранные наборы" },
    { value: "IN_COLLECTED", label: "🔄 Собран", description: "Собранные наборы" },
    { value: "SOLD", label: "💰 Продано", description: "Проданные товары" },
    { value: "CREDIT", label: "💳 В кредите", description: "Отданные в кредит" },
    { value: "LOST", label: "❌ Утеряно", description: "Утерянные товары" }
  ];

  // Быстрые фильтры (мультистатусы)
  const quickFilters = [
    { 
      value: "all", 
      label: "Все", 
      description: "Показать все товары",
      statuses: ["all"]
    },
    { 
      value: "IN_STORE,CLEAR,ARRIVED", 
      label: "Активные", 
      description: "Товары доступные для операций",
      statuses: ["IN_STORE", "CLEAR", "ARRIVED"]
    },
    { 
      value: "IN_STORE,IN_DISASSEMBLED", 
      label: "Для сборки", 
      description: "Можно разбирать/собирать",
      statuses: ["IN_STORE", "IN_DISASSEMBLED"]
    },
    { 
      value: "IN_STORE,CLEAR,ARRIVED,IN_DISASSEMBLED,IN_COLLECTED", 
      label: "Без проданных", 
      description: "Исключить проданные и утерянные",
      statuses: ["IN_STORE", "CLEAR", "ARRIVED", "IN_DISASSEMBLED", "IN_COLLECTED"]
    },
    { 
      value: "SOLD,CREDIT,LOST", 
      label: "Архив", 
      description: "Только проданные/утерянные",
      statuses: ["SOLD", "CREDIT", "LOST"]
    }
  ];

  // Получить описание для выбранного статуса
  const getCurrentStatusDescription = () => {
    if (selectedStatus === "all") return "Показать все товары";
    
    // Проверяем быстрые фильтры
    const quickFilter = quickFilters.find(filter => filter.value === selectedStatus);
    if (quickFilter) return quickFilter.description;
    
    // Проверяем одиночные статусы
    const singleStatus = statusOptions.find(opt => opt.value === selectedStatus);
    if (singleStatus) return singleStatus.description;
    
    // Мультистатус (пользовательский)
    const statusCount = selectedStatus.split(',').length;
    return `Показано ${statusCount} статусов`;
  };

  // Получить лейбл для выбранного статуса
  const getCurrentStatusLabel = () => {
    if (selectedStatus === "all") return "Все статусы";
    
    const quickFilter = quickFilters.find(filter => filter.value === selectedStatus);
    if (quickFilter) return quickFilter.label;
    
    const singleStatus = statusOptions.find(opt => opt.value === selectedStatus);
    if (singleStatus) return singleStatus.label;
    
    return "Несколько статусов";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Поиск по названию и артикулу */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Поиск товаров
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
            Поиск по названию, коду, серийному номеру
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
            📊 Статус
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            {/* Быстрые фильтры */}
            <optgroup label="Быстрые фильтры">
              {quickFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </optgroup>
            
            {/* Все отдельные статусы */}
            <optgroup label="Отдельные статусы">
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {getCurrentStatusDescription()}
          </p>
        </div>

      </div>

      {/* Быстрые кнопки фильтров */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🚀 Быстрые фильтры:
        </label>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onStatusChange(filter.value)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center space-x-2 ${
                selectedStatus === filter.value
                  ? "bg-blue-100 text-blue-800 border-blue-300 shadow-sm"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              <span>{filter.label}</span>
              {filter.statuses.length > 1 && (
                <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                  {filter.statuses.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Текущие активные фильтры */}
      {(selectedStatus !== "all" || selectedBrand !== "all" || searchQuery) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Активные фильтры:</div>
          <div className="flex flex-wrap gap-2">
            {selectedStatus !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                📊 {getCurrentStatusLabel()}
                <button
                  onClick={() => onStatusChange("all")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedBrand !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                🏷️ {selectedBrand}
                <button
                  onClick={() => onBrandChange("all")}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ✕
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                🔍 "{searchQuery}"
                <button
                  onClick={() => onSearchChange("")}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}