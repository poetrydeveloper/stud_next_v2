// app/product-units/components/UnitTreeView.tsx
"use client";

import { useState } from "react";
import UnitMiniCard from "../../product-units/components/unit/UnitMiniCard";

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
  parentId?: number | null;
  children?: CategoryWithSpines[];
}

interface UnitTreeViewProps {
  categories: CategoryWithSpines[];
}

// Рекурсивная функция для построения дерева категорий
function buildCategoryTree(categories: CategoryWithSpines[]): CategoryWithSpines[] {
  const categoryMap = new Map<number, CategoryWithSpines>();
  const rootCategories: CategoryWithSpines[] = [];

  // Сначала создаем карту всех категорий
  categories.forEach(category => {
    categoryMap.set(category.id, {
      ...category,
      children: []
    });
  });

  // Затем строим дерево
  categories.forEach(category => {
    const node = categoryMap.get(category.id)!;
    
    if (category.parentId && categoryMap.has(category.parentId)) {
      // Это дочерняя категория
      const parent = categoryMap.get(category.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    } else {
      // Это корневая категория
      rootCategories.push(node);
    }
  });

  return rootCategories;
}

// Рекурсивный компонент для отображения узла дерева
function TreeNode({ 
  node, 
  level = 0,
  expandedNodes,
  onToggle 
}: { 
  node: CategoryWithSpines;
  level: number;
  expandedNodes: number[];
  onToggle: (nodeId: number) => void;
}) {
  const isExpanded = expandedNodes.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const hasSpines = node.spines && node.spines.length > 0;

  // Вычисляем отступ на основе уровня вложенности
  const indentSize = level * 24; // 24px на каждый уровень
  const borderColor = level === 0 ? 'border-blue-200' : 
                     level === 1 ? 'border-green-200' : 
                     level === 2 ? 'border-purple-200' : 
                     'border-gray-200';

  return (
    <div className={`ml-${indentSize}px ${level > 0 ? 'border-l-2 ' + borderColor + ' pl-4' : ''}`}>
      {/* Заголовок категории */}
      <div 
        className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onToggle(node.id)}
      >
        <div className="flex items-center space-x-3">
          {/* Стрелка раскрытия если есть дети или spine */}
          {(hasChildren || hasSpines) && (
            <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''} text-gray-500`}>
              ▶
            </div>
          )}
          <div className="flex items-center space-x-3">
            {/* Иконка категории с разными цветами для уровней */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
              ${level === 0 ? 'bg-blue-500' : 
                level === 1 ? 'bg-green-500' : 
                level === 2 ? 'bg-purple-500' : 
                'bg-gray-500'}
            `}>
              {level + 1}
            </div>
            <div>
              <h3 className={`font-semibold ${
                level === 0 ? 'text-lg text-blue-900' : 
                level === 1 ? 'text-green-900' : 
                level === 2 ? 'text-purple-900' : 
                'text-gray-900'
              }`}>
                {node.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                {hasChildren && (
                  <span>{node.children!.length} подкатегорий</span>
                )}
                {hasSpines && (
                  <span>{node.spines.length} Spine</span>
                )}
                <span>
                  Всего единиц: {node.spines.reduce((sum, spine) => sum + spine.productUnits.length, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {isExpanded ? 'Скрыть' : 'Показать'}
          </span>
        </div>
      </div>

      {/* Содержимое узла (дети + spine) */}
      {isExpanded && (
        <div className="space-y-3 mt-2">
          {/* Рекурсивно рендерим дочерние категории */}
          {hasChildren && node.children!.map(child => (
            <TreeNode 
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
            />
          ))}

          {/* Рендерим Spine этой категории */}
          {hasSpines && node.spines.map(spine => (
            <SpineNode 
              key={spine.id}
              spine={spine}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Компонент для отображения Spine
function SpineNode({ 
  spine, 
  level,
  expandedNodes,
  onToggle 
}: { 
  spine: SpineWithUnits;
  level: number;
  expandedNodes: number[];
  onToggle: (nodeId: number) => void;
}) {
  const isExpanded = expandedNodes.includes(-spine.id); // отрицательные ID для Spine
  const indentSize = level * 24;
  const hasUnits = spine.productUnits.length > 0;

  // Статистика по статусам
  const getStatusStats = () => {
    const stats = {
      CLEAR: spine.productUnits.filter(u => u.statusCard === "CLEAR").length,
      CANDIDATE: spine.productUnits.filter(u => u.statusCard === "CANDIDATE").length,
      IN_REQUEST: spine.productUnits.filter(u => u.statusCard === "IN_REQUEST").length,
      IN_STORE: spine.productUnits.filter(u => u.statusProduct === "IN_STORE").length,
      SOLD: spine.productUnits.filter(u => u.statusProduct === "SOLD").length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className={`ml-${indentSize}px border-l-2 border-orange-200 pl-4`}>
      {/* Заголовок Spine */}
      <div 
        className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200 mb-2 cursor-pointer hover:bg-orange-100 transition-colors"
        onClick={() => onToggle(-spine.id)}
      >
        <div className="flex items-center space-x-3">
          {/* Стрелка раскрытия если есть units */}
          {hasUnits && (
            <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''} text-orange-500`}>
              ▶
            </div>
          )}
          <div className="flex items-center space-x-3">
            {/* Иконка Spine */}
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <div>
              <h4 className="font-semibold text-orange-900">{spine.name}</h4>
              <div className="flex items-center space-x-3 text-sm text-orange-700 mt-1">
                <span>{spine.productUnits.length} единиц</span>
                
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-orange-600">
            {isExpanded ? 'Скрыть' : 'Показать'}
          </span>
        </div>
      </div>

      {/* Units внутри Spine */}
      {isExpanded && hasUnits && (
        <div className="ml-6 border-l-2 border-gray-300 pl-4 p-3">
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
}

export default function UnitTreeView({ categories }: UnitTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<number[]>([]);

  // Строим дерево категорий
  const categoryTree = buildCategoryTree(categories);

  const toggleNode = (nodeId: number) => {
    setExpandedNodes(prev =>
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  // Общая статистика
  const totalUnits = categories.reduce(
    (sum, category) => sum + category.spines.reduce(
      (spineSum, spine) => spineSum + spine.productUnits.length, 0
    ), 0
  );

  const totalCategories = categories.length;
  const totalSpines = categories.reduce((sum, cat) => sum + cat.spines.length, 0);

  return (
    <div className="max-h-screen overflow-y-auto">
      {/* Общая статистика */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{totalCategories}</div>
            <div className="text-sm text-blue-800">Категорий</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">{totalSpines}</div>
            <div className="text-sm text-orange-800">Spine</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{totalUnits}</div>
            <div className="text-sm text-green-800">Товарных единиц</div>
          </div>
        </div>
      </div>

      {categoryTree.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-4xl mb-4">🌳</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Дерево категорий пустое</h3>
          <p className="text-gray-500 mb-4">Создайте категории и Spine чтобы начать работу</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categoryTree.map(category => (
            <TreeNode 
              key={category.id}
              node={category}
              level={0}
              expandedNodes={expandedNodes}
              onToggle={toggleNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}