// app/product-units/components/UnitTreeView.tsx
"use client";

import { useState } from "react";
import UnitMiniCard from "./UnitMiniCard";

interface TreeNode {
  [key: string]: {
    type: string;
    path: string;
    children: TreeNode;
  };
}

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

interface UnitTreeViewProps {
  categories: CategoryWithSpines[];
}

export default function UnitTreeView({ categories }: UnitTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<number[]>([]);

  const toggleNode = (nodeId: number) => {
    setExpandedNodes(prev =>
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const getStatusStats = (spine: SpineWithUnits) => {
    const stats = {
      CLEAR: spine.productUnits.filter(u => u.statusCard === "CLEAR").length,
      CANDIDATE: spine.productUnits.filter(u => u.statusCard === "CANDIDATE").length,
      IN_REQUEST: spine.productUnits.filter(u => u.statusCard === "IN_REQUEST").length,
      IN_STORE: spine.productUnits.filter(u => u.statusProduct === "IN_STORE").length,
      SOLD: spine.productUnits.filter(u => u.statusProduct === "SOLD").length,
    };
    return stats;
  };

  return (
    <div className="max-h-screen overflow-y-auto">
      {categories.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Нет категорий с товарами.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map(category => {
            const isCategoryExpanded = expandedNodes.includes(category.id);
            const totalUnits = category.spines.reduce(
              (sum, spine) => sum + spine.productUnits.length, 0
            );

            return (
              <li key={category.id} className="bg-white rounded-lg border border-gray-200">
                {/* Категория */}
                <div 
                  className="flex items-center justify-between p-4 bg-gradient-to-b from-blue-50 to-blue-100 border-b border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => toggleNode(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`transform transition-transform ${isCategoryExpanded ? 'rotate-90' : ''}`}>
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
                    <span className="text-sm text-gray-500">
                      {isCategoryExpanded ? 'Скрыть' : 'Показать'}
                    </span>
                  </div>
                </div>

                {/* Содержимое категории - ДОБАВИЛИ ОТСТУПЫ */}
                {isCategoryExpanded && (
                  <div className="ml-6 border-l border-gray-200 pl-4 space-y-4">
                    {category.spines.map(spine => {
                      const isSpineExpanded = expandedNodes.includes(-spine.id);
                      const stats = getStatusStats(spine);

                      return (
                        <div key={spine.id} className="bg-gray-50 rounded-lg border border-gray-200">
                          {/* Spine */}
                          <div 
                            className="flex items-center justify-between p-3 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleNode(-spine.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`transform transition-transform ${isSpineExpanded ? 'rotate-90' : ''}`}>
                                ▶
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{spine.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {spine.productUnits.length} единиц
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {/* Мини-статистика статусов */}
                              <div className="flex space-x-1">
                                {stats.CLEAR > 0 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-800">
                                    {stats.CLEAR}🟢
                                  </span>
                                )}
                                {stats.CANDIDATE > 0 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                                    {stats.CANDIDATE}🟡
                                  </span>
                                )}
                                {stats.IN_REQUEST > 0 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                    {stats.IN_REQUEST}🔵
                                  </span>
                                )}
                                {stats.IN_STORE > 0 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                                    {stats.IN_STORE}📦
                                  </span>
                                )}
                              </div>
                              
                              <span className="text-sm text-gray-500">
                                {isSpineExpanded ? 'Скрыть' : 'Показать'}
                              </span>
                            </div>
                          </div>

                          {/* Units внутри Spine - ДОБАВИЛИ ОТСТУПЫ */}
                          {isSpineExpanded && spine.productUnits.length > 0 && (
                            <div className="ml-6 border-l border-gray-200 pl-4 p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {spine.productUnits.map(unit => (
                                  <UnitMiniCard 
                                    key={unit.id} 
                                    unit={unit} 
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {category.spines.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        <div className="text-3xl mb-2">📭</div>
                        <p>Нет Spine в этой категории</p>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}