// app/product-units/components/unit/CategoryTreeView.tsx
"use client";

import { useState } from "react";
import SpineCard from "./SpineCard";

interface Category {
  id: number;
  name: string;
  spines: Array<{
    id: number;
    name: string;
    productUnits: Array<any>;
  }>;
}

interface CategoryTreeViewProps {
  categories: Category[];
}

export default function CategoryTreeView({ categories }: CategoryTreeViewProps) {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="space-y-4">
      {categories.map(category => {
        const isExpanded = expandedCategories.includes(category.id);
        const totalUnits = category.spines.reduce(
          (sum, spine) => sum + spine.productUnits.length, 0
        );

        return (
          <div key={category.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Шапка категории */}
            <div 
              className="flex items-center justify-between p-4 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                  ▶
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">
                    {category.spines.length} Spine • {totalUnits} единиц
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Статистика по статусам */}
                <div className="flex space-x-1">
                  {getStatusStats(category).map(stat => (
                    <span 
                      key={stat.status}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stat.bgColor} ${stat.textColor}`}
                      title={stat.tooltip}
                    >
                      {stat.count}
                    </span>
                  ))}
                </div>
                
                <span className="text-sm text-gray-500">
                  {isExpanded ? 'Скрыть' : 'Показать'}
                </span>
              </div>
            </div>

            {/* Содержимое категории */}
            {isExpanded && (
              <div className="p-4 space-y-4">
                {category.spines.map(spine => (
                  <SpineCard 
                    key={spine.id} 
                    spine={spine} 
                    units={spine.productUnits} 
                  />
                ))}
                
                {category.spines.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📭</div>
                    <p>Нет Spine в этой категории</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Вспомогательная функция для статистики статусов
function getStatusStats(category: Category) {
  const stats = {
    CLEAR: { count: 0, bgColor: 'bg-blue-100', textColor: 'text-blue-800', tooltip: 'CLEAR' },
    CANDIDATE: { count: 0, bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', tooltip: 'CANDIDATE' },
    IN_REQUEST: { count: 0, bgColor: 'bg-indigo-100', textColor: 'text-indigo-800', tooltip: 'IN_REQUEST' },
    IN_STORE: { count: 0, bgColor: 'bg-green-100', textColor: 'text-green-800', tooltip: 'IN_STORE' },
    SOLD: { count: 0, bgColor: 'bg-purple-100', textColor: 'text-purple-800', tooltip: 'SOLD' },
  };

  category.spines.forEach(spine => {
    spine.productUnits.forEach(unit => {
      if (unit.statusCard in stats) {
        stats[unit.statusCard as keyof typeof stats].count++;
      }
      if (unit.statusProduct in stats) {
        stats[unit.statusProduct as keyof typeof stats].count++;
      }
    });
  });

  return Object.values(stats).filter(stat => stat.count > 0);
}