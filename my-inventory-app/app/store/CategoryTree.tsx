// app/store/CategoryTree.tsx
"use client";

interface Category {
  id: number;
  name: string;
  slug: string;
  path: string;
  children?: Category[];
}

interface CategoryTreeProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

export default function CategoryTree({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryTreeProps) {
  
  const renderCategoryNode = (category: Category, level: number = 0) => {
    const isSelected = selectedCategory === category.id;
    const hasChildren = category.children && category.children.length > 0;
    
    return (
      <div key={category.id} className="mb-1">
        {/* Основная категория */}
        <div 
          className={`
            flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors
            ${isSelected 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'hover:bg-gray-100 text-gray-700'
            }
          `}
          onClick={() => onCategorySelect(isSelected ? null : category.id)}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <span className="text-sm truncate">{category.name}</span>
            {hasChildren && (
              <span className="text-xs text-gray-400">
                ({category.children?.length})
              </span>
            )}
          </div>
          
          {/* Индикатор выбора */}
          {isSelected && (
            <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 flex-shrink-0"></div>
          )}
        </div>

        {/* Дочерние категории - ВАЖНО: показываем ВСЕ уровни вложенности */}
        {hasChildren && (
          <div className="mt-1">
            {category.children!.map(child => 
              renderCategoryNode(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Заголовок */}
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">📁</span>
          Категории товаров
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {categories.length} основных категорий
        </p>
      </div>

      {/* Кнопка "Все категории" */}
      <div 
        className={`
          flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors mb-3
          ${selectedCategory === null 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'hover:bg-gray-100 text-gray-700'
          }
        `}
        onClick={() => onCategorySelect(null)}
      >
        <div className="flex items-center space-x-2">
          <span>📦</span>
          <span className="text-sm font-medium">Все товары</span>
        </div>
        {selectedCategory === null && (
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
        )}
      </div>

      {/* Дерево категорий */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">Категории не найдены</p>
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map(category => renderCategoryNode(category, 0))}
          </div>
        )}
      </div>

      {/* Статус выбора */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {selectedCategory ? (
            <span>Выбрана категория</span>
          ) : (
            <span>Показаны все товары</span>
          )}
        </div>
      </div>
    </div>
  );
}