// app/super-add/components/ImprovedTreeView.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { TreeViewProps, TreeNode } from '../types';

// Тип для маппинга названий
interface NameMapping {
  [key: string]: string;
}

export default function ImprovedTreeView({ tree, selectedPath, onSelect }: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [nameMapping, setNameMapping] = useState<NameMapping>({});
  const [loadingNames, setLoadingNames] = useState(true);

  // Загружаем русские названия из базы данных
  useEffect(() => {
    const loadRussianNames = async () => {
      try {
        console.log('🔄 Загрузка русских названий из БД...');
        const response = await fetch('/api/structure/russian-names');
        const result = await response.json();
        
        if (result.success) {
          setNameMapping(result.nameMapping);
          console.log('✅ Загружено русских названий:', Object.keys(result.nameMapping).length);
        } else {
          console.error('❌ Ошибка загрузки названий:', result.error);
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки русских названий:', error);
      } finally {
        setLoadingNames(false);
      }
    };

    loadRussianNames();
  }, []);

  // Функция для получения русского названия
  const getRussianName = (technicalName: string, data: any): string => {
  try {
    // ПРОСТО ИСПОЛЬЗУЕМ data.name который УЖЕ содержит русское название из БД
    if (data.name) {
      return data.name;
    }
    
    // Fallback на случай если data.name отсутствует
    // Преобразуем техническое имя в читаемый формат
    return technicalName
      .replace(/^d_/, '')  // убираем префикс категории
      .replace(/^s_/, '')  // убираем префикс spine
      .replace(/^p_/, '')  // убираем префикс продукта
      .replace(/\.json$/, '') // убираем расширение у продуктов
      .replace(/_/g, ' ')  // заменяем подчеркивания на пробелы
      .replace(/\b\w/g, l => l.toUpperCase()) // capitalize words
      .trim();
      
  } catch (error) {
    console.error('Ошибка преобразования имени:', error);
    return technicalName;
  }
};

  console.log('🔍 ImprovedTreeView: ДАННЫЕ ДЕРЕВА', tree);

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

  // Автоматически сворачиваем все узлы при загрузке
  useEffect(() => {
    const rootNodes = new Set();
    Object.keys(tree).forEach(key => {
      if (tree[key]?.path) {
        const pathParts = tree[key].path.split('/');
        if (pathParts.length === 1) {
          rootNodes.add(tree[key].path);
        }
      }
    });
    setExpandedNodes(rootNodes);
  }, [tree]);

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
      return count + 1 + (child.children ? getChildrenCount(child.children) : 0);
    }, 0);
  };

  // Функция для поиска по всему дереву
  const searchInTree = useMemo(() => {
    if (!searchTerm) return null;

    const results = new Set<string>();
    
    const searchRecursive = (node: TreeNode, currentPath: string = '') => {
      Object.entries(node).forEach(([technicalName, data]) => {
        const russianName = getRussianName(technicalName, data);
        const nodePath = data.path || '';
        
        if (russianName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            technicalName.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.add(nodePath);
        }
        
        if (data.children) {
          searchRecursive(data.children, nodePath);
        }
      });
    };
    
    searchRecursive(tree);
    return results;
  }, [tree, searchTerm, nameMapping]);

  if (loadingNames) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white p-4">
        <div className="text-center text-gray-500">
          Загрузка русских названий...
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Строка поиска */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="🔍 Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        {searchTerm && searchInTree && (
          <div className="mt-2 text-sm text-gray-600">
            Найдено: {searchInTree.size} элементов
          </div>
        )}
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
            searchResults={searchInTree}
            getNodeIcon={getNodeIcon}
            getChildrenCount={getChildrenCount}
            getRussianName={getRussianName}
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
  searchResults,
  getNodeIcon,
  getChildrenCount,
  getRussianName
}: { 
  node: TreeNode; 
  level: number;
  selectedPath: string;
  onSelect: (path: string) => void;
  expandedNodes: Set<string>;
  onToggle: (path: string) => void;
  searchTerm: string;
  searchResults: Set<string> | null;
  getNodeIcon: (type: string, hasChildren: boolean, isExpanded: boolean) => string;
  getChildrenCount: (node: TreeNode) => number;
  getRussianName: (technicalName: string, data: any) => string;
}) {
  const filteredEntries = useMemo(() => {
    return Object.entries(node).filter(([technicalName, data]) => {
      if (!searchTerm) return true;
      
      const russianName = getRussianName(technicalName, data);
      const matchesSearch = russianName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           technicalName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Если есть поиск, показываем только соответствующие элементы или их родителей
      if (searchResults) {
        return matchesSearch || searchResults.has(data.path);
      }
      
      return matchesSearch;
    });
  }, [node, searchTerm, searchResults]);

  if (filteredEntries.length === 0) {
    return <div className="py-2 text-gray-500 text-center">Ничего не найдено</div>;
  }

  return (
    <ul>
      {filteredEntries.map(([technicalName, data]) => {
        const nodePath = data.path || '';
        const russianName = getRussianName(technicalName, data);
        const hasChildren = data.children && Object.keys(data.children).length > 0;
        const isExpanded = expandedNodes.has(nodePath);
        const childrenCount = hasChildren ? getChildrenCount(data.children) : 0;
        const isSearchMatch = searchResults ? searchResults.has(nodePath) : false;
        
        return (
          <li key={technicalName} className="my-1">
            <div className="flex items-center group">
              {/* Отступ для уровня вложенности */}
              <div style={{ width: `${level * 20}px` }}></div>
              
              {/* Кнопка раскрытия/свертывания */}
              {hasChildren && (
                <button
                  onClick={() => onToggle(nodePath)}
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded mr-1 transition-colors"
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
                    : isSearchMatch
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      : data.type === 'category' 
                        ? 'bg-blue-50 hover:bg-blue-100 text-blue-700' 
                        : data.type === 'spine' 
                          ? 'bg-green-50 hover:bg-green-100 text-green-700'
                          : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                }`}
                disabled={!nodePath}
                title={`${russianName} (${data.type})`}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate font-medium">{russianName}</span>
                  {hasChildren && (
                    <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded border ml-2">
                      {childrenCount}
                    </span>
                  )}
                </div>
                {/* Техническое имя маленьким шрифтом */}
                <div className="text-xs text-gray-500 truncate mt-1">
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
                  searchResults={searchResults}
                  getNodeIcon={getNodeIcon}
                  getChildrenCount={getChildrenCount}
                  getRussianName={getRussianName}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}