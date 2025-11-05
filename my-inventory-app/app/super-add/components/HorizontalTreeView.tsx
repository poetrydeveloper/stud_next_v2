// app/super-add/components/HorizontalTreeView.tsx
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { HorizontalTreeViewProps, HorizontalTreeNode } from '../types';

// Функция для преобразования латинских имен в читаемые
const getRussianName = (technicalName: string): string => {
  const nameMapping: { [key: string]: string } = {
    // Категории
    'd_bity': 'Биты',
    'd_metalloobrabotka': 'Металлообработка',
    'd_oborudovanie': 'Оборудование',
    'd_pnevmatika': 'Пневматика',
    'd_pod-emnoe': 'Подъемное',
    'd_ruchnoy-instrument': 'Ручной инструмент',
    'd_klyuchi': 'Ключи',
    'd_otvertki': 'Отвертки',
    
    // Spines
    's_torx_t30': 'TORX T30',
    's_hex_8mm': 'HEX 8мм',
    's_kluch_10mm': 'Ключ 10мм',
  };

  // Для продуктов
  if (technicalName.startsWith('p_')) {
    const productCode = technicalName.replace('p_', '').replace('.json', '');
    return `Продукт ${productCode}`;
  }

  return nameMapping[technicalName] || technicalName
    .replace(/^d_/, '')
    .replace(/^s_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

// Функция для преобразования TreeNode в HorizontalTreeNode
const convertToHorizontalTree = (
  node: any, 
  level: number = 0, 
  startY: number = 0
): HorizontalTreeNode[] => {
  const nodes: HorizontalTreeNode[] = [];
  let currentY = startY;

  Object.entries(node).forEach(([technicalName, data]) => {
    const nodeData = data as any;
    const russianName = getRussianName(technicalName);
    
    const horizontalNode: HorizontalTreeNode = {
      technicalName,
      russianName,
      type: nodeData.type,
      path: nodeData.path,
      children: [],
      level,
      x: level * 200, // Фиксированный отступ по X для каждого уровня
      y: currentY
    };

    nodes.push(horizontalNode);
    currentY += 60; // Высота каждого узла

    // Рекурсивно добавляем детей
    if (nodeData.children && Object.keys(nodeData.children).length > 0) {
      const childNodes = convertToHorizontalTree(nodeData.children, level + 1, currentY);
      horizontalNode.children = childNodes;
      currentY += childNodes.length * 60;
    }
  });

  return nodes;
};

export default function HorizontalTreeView({ tree, selectedPath, onSelect }: HorizontalTreeViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<HorizontalTreeNode | null>(null);

  // Преобразуем дерево в горизонтальный формат
  const horizontalTree = useMemo(() => {
    return convertToHorizontalTree(tree);
  }, [tree]);

  // Рассчитываем размеры контейнера
  const containerSize = useMemo(() => {
    if (horizontalTree.length === 0) return { width: 800, height: 400 };
    
    const maxLevel = Math.max(...horizontalTree.flatMap(node => 
      [node.level, ...node.children.map(child => child.level)]
    ));
    const totalHeight = Math.max(...horizontalTree.flatMap(node => 
      [node.y, ...node.children.map(child => child.y)]
    )) + 100;
    
    return {
      width: (maxLevel + 1) * 200 + 100,
      height: totalHeight + 100
    };
  }, [horizontalTree]);

  // Функция для поиска узлов
  const searchResults = useMemo(() => {
    if (!searchTerm) return new Set<string>();
    
    const results = new Set<string>();
    
    const searchInNodes = (nodes: HorizontalTreeNode[]) => {
      nodes.forEach(node => {
        if (node.russianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.technicalName.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.add(node.path);
        }
        searchInNodes(node.children);
      });
    };
    
    searchInNodes(horizontalTree);
    return results;
  }, [horizontalTree, searchTerm]);

  // Функция для прокрутки к найденному элементу
  const scrollToNode = (path: string) => {
    const node = findNodeByPath(horizontalTree, path);
    if (node && containerRef.current) {
      containerRef.current.scrollTo({
        left: node.x - 200,
        top: node.y - 100,
        behavior: 'smooth'
      });
    }
  };

  // Вспомогательная функция для поиска узла по пути
  const findNodeByPath = (nodes: HorizontalTreeNode[], path: string): HorizontalTreeNode | null => {
    for (const node of nodes) {
      if (node.path === path) return node;
      const foundInChildren = findNodeByPath(node.children, path);
      if (foundInChildren) return foundInChildren;
    }
    return null;
  };

  // Обработчик выбора узла
  const handleNodeSelect = (node: HorizontalTreeNode) => {
    setSelectedNode(node);
    onSelect(node.path);
  };

  // Рендер узла дерева
  const renderNode = (node: HorizontalTreeNode) => {
    const isSelected = selectedPath === node.path;
    const isSearchMatch = searchResults.has(node.path);
    
    return (
      <g key={node.path}>
        {/* Линия к родителю (если не корневой) */}
        {node.level > 0 && (
          <line
            x1={node.x - 180}
            y1={node.y + 20}
            x2={node.x - 20}
            y2={node.y + 20}
            stroke="#94a3b8"
            strokeWidth="1"
          />
        )}
        
        {/* Прямоугольник узла */}
        <rect
          x={node.x}
          y={node.y}
          width={160}
          height={40}
          rx="8"
          fill={
            isSelected ? '#3b82f6' :
            isSearchMatch ? '#f59e0b' :
            node.type === 'category' ? '#dbeafe' :
            node.type === 'spine' ? '#dcfce7' :
            '#f3e8ff'
          }
          stroke={isSelected ? '#1d4ed8' : '#cbd5e1'}
          strokeWidth="2"
          className="cursor-pointer hover:stroke-2 hover:stroke-blue-500 transition-all"
          onClick={() => handleNodeSelect(node)}
        />
        
        {/* Текст узла */}
        <text
          x={node.x + 80}
          y={node.y + 20}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium pointer-events-none select-none"
          fill={
            isSelected ? '#ffffff' :
            node.type === 'category' ? '#1e40af' :
            node.type === 'spine' ? '#166534' :
            '#7e22ce'
          }
        >
          {node.russianName}
        </text>
        
        {/* Иконка типа */}
        <text
          x={node.x + 10}
          y={node.y + 15}
          className="text-xs pointer-events-none select-none"
          fill={isSelected ? '#ffffff' : '#64748b'}
        >
          {node.type === 'category' ? '📁' : 
           node.type === 'spine' ? '🌿' : '📦'}
        </text>
        
        {/* Рекурсивный рендер детей */}
        {node.children.map(child => renderNode(child))}
      </g>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Панель управления */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {searchTerm && (
            <>
              <button
                onClick={() => {
                  const results = Array.from(searchResults);
                  if (results.length > 0) {
                    scrollToNode(results[0]);
                  }
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                disabled={searchResults.size === 0}
              >
                Найти ({searchResults.size})
              </button>
              <button
                onClick={() => setSearchTerm('')}
                className="px-3 py-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      {/* Область дерева с прокруткой */}
      <div 
        ref={containerRef}
        className="relative overflow-auto bg-gray-50"
        style={{ height: '500px' }}
      >
        {horizontalTree.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Дерево пустое. Создайте первую категорию.
          </div>
        ) : (
          <svg
            width={containerSize.width}
            height={containerSize.height}
            className="min-w-full min-h-full"
          >
            {horizontalTree.map(node => renderNode(node))}
          </svg>
        )}
      </div>

      {/* Информация о выбранном узле */}
      {selectedNode && (
        <div className="p-3 border-t border-gray-200 bg-blue-50">
          <div className="text-sm text-blue-800">
            <strong>Выбрано:</strong> {selectedNode.russianName} 
            <span className="text-blue-600 ml-2">({selectedNode.technicalName})</span>
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Путь: {selectedNode.path}
          </div>
        </div>
      )}
    </div>
  );
}