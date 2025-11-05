// app/super-add/components/ImprovedTreeView.tsx
'use client';

import { useState, useEffect } from 'react';
import { TreeViewProps, TreeNode } from '../types';

export default function ImprovedTreeView({ tree, selectedPath, onSelect }: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  console.log('🔍 ImprovedTreeView: Рендер дерева', { tree, selectedPath });

  // Автоматически раскрываем путь к выбранному элементу
  useEffect(() => {
    if (selectedPath) {
      const paths = selectedPath.split('/').filter(Boolean);
      let currentPath = '';
      const newExpanded = new Set(expandedNodes);
      
      paths.forEach(part => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        newExpanded.add(currentPath);
      });
      
      setExpandedNodes(newExpanded);
    }
  }, [selectedPath]);

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const getNodeIcon = (type: string, hasChildren: boolean, isExpanded: boolean) => {
    switch (type) {
      case 'category':
        return hasChildren 
          ? (isExpanded ? '📂' : '📁')
          : '📁';
      case 'spine':
        return '🌿';
      case 'product':
        return '📦';
      default:
        return '❓';
    }
  };

  const getChildrenCount = (node: TreeNode): number => {
    return Object.keys(node).reduce((count, key) => {
      const child = node[key];
      return count + 1 + getChildrenCount(child.children || {});
    }, 0);
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Строка поиска */}
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          placeholder="🔍 Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="max-h-96 overflow-y-auto p-2">
        {Object.keys(tree).length === 0 ? (
          <p className="text-gray-500 text-center py-8">Дерево пустое. Создайте первую категорию.</p>
        ) : (
          <RenderTree 
            node={tree} 
            level={0} 
            selectedPath={selectedPath}
            onSelect={onSelect}
            expandedNodes={expandedNodes}
            onToggle={toggleNode}
            searchTerm={searchTerm}
            getNodeIcon={getNodeIcon}
            getChildrenCount={getChildrenCount}
          />
        )}
      </div>
    </div>
  );
}

function RenderTree({ 
  node, 
  level, 
  selectedPath, 
  onSelect, 
  expandedNodes, 
  onToggle, 
  searchTerm,
  getNodeIcon,
  getChildrenCount
}: { 
  node: TreeNode; 
  level: number;
  selectedPath: string;
  onSelect: (path: string) => void;
  expandedNodes: Set<string>;
  onToggle: (path: string) => void;
  searchTerm: string;
  getNodeIcon: (type: string, hasChildren: boolean, isExpanded: boolean) => string;
  getChildrenCount: (node: TreeNode) => number;
}) {
  // Фильтрация по поиску
  const filteredEntries = Object.entries(node).filter(([technicalName, data]) => {
    if (!searchTerm) return true;
    const displayName = data.name || technicalName;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (filteredEntries.length === 0) {
    return <div className="py-2 text-gray-500 text-center">Ничего не найдено</div>;
  }

  return (
    <ul>
      {filteredEntries.map(([technicalName, data]) => {
        const nodePath = data.path || '';
        const displayName = data.name || technicalName;
        const hasChildren = data.children && Object.keys(data.children).length > 0;
        const isExpanded = expandedNodes.has(nodePath);
        const childrenCount = hasChildren ? getChildrenCount(data.children) : 0;
        
        return (
          <li key={technicalName} className="my-1">
            <div className="flex items-center group">
              {/* Отступ для уровня вложенности */}
              <div style={{ width: `${level * 20}px` }}></div>
              
              {/* Кнопка раскрытия/свертывания */}
              {hasChildren && (
                <button
                  onClick={() => onToggle(nodePath)}
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded mr-1"
                >
                  {isExpanded ? '▼' : '►'}
                </button>
              )}
              {!hasChildren && <div className="w-6 h-6 mr-1"></div>}
              
              {/* Иконка типа элемента */}
              <span className="mr-2 text-sm">
                {getNodeIcon(data.type, hasChildren, isExpanded)}
              </span>
              
              {/* Основная кнопка выбора */}
              <button
                onClick={() => nodePath && onSelect(nodePath)}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors text-left group ${
                  selectedPath === nodePath 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : data.type === 'category' 
                      ? 'bg-blue-50 hover:bg-blue-100 text-blue-700' 
                      : data.type === 'spine' 
                        ? 'bg-green-50 hover:bg-green-100 text-green-700'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                }`}
                disabled={!nodePath}
                title={`${displayName} (${data.type})`}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{displayName}</span>
                  {hasChildren && (
                    <span className="text-xs text-gray-500 bg-white px-1 rounded ml-2">
                      {childrenCount}
                    </span>
                  )}
                </div>
                {/* Техническое имя маленьким шрифтом */}
                <div className="text-xs text-gray-500 truncate">
                  {technicalName}
                </div>
              </button>
            </div>
            
            {/* Дочерние элементы */}
            {hasChildren && isExpanded && (
              <div className="ml-6 border-l border-gray-200 pl-2">
                <RenderTree 
                  node={data.children} 
                  level={level + 1} 
                  selectedPath={selectedPath}
                  onSelect={onSelect}
                  expandedNodes={expandedNodes}
                  onToggle={onToggle}
                  searchTerm={searchTerm}
                  getNodeIcon={getNodeIcon}
                  getChildrenCount={getChildrenCount}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}