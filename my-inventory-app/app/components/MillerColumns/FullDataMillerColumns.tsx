// components/MillerColumns/FullDataMillerColumns.tsx
'use client';

import { useState, useMemo } from 'react';
import styles from './MillerColumns.module.css';

type TreeNode = {
  id: number;
  name: string;
  path: string;
  type: 'category' | 'spine' | 'product';
  hasChildren: boolean;
  children?: TreeNode[];
  spines?: TreeNode[];
  products?: TreeNode[];
};

type Props = { 
  initialData: TreeNode[];
  stats: {
    totalCategories: number;
    totalSpines: number;
    totalProducts: number;
  };
};

// Функция для получения детей узла - ВЫНЕСЕМ НАВЕРХ
const getChildren = (node: TreeNode): TreeNode[] => {
  if (node.type === 'category') {
    return [...(node.children || []), ...(node.spines || [])];
  } else if (node.type === 'spine') {
    return node.products || [];
  }
  return [];
};

export function FullDataMillerColumns({ initialData, stats }: Props) {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  // Строим колонки на основе выбранного пути
  const columns = useMemo(() => {
    const result: TreeNode[][] = [initialData];
    
    let currentLevel = initialData;
    
    // Проходим по выбранному пути и находим детей для каждого уровня
    for (const pathSegment of selectedPath) {
      const nextNode = currentLevel.find(node => node.path === pathSegment);
      if (nextNode) {
        const children = getChildren(nextNode);
        if (children.length > 0) {
          result.push(children);
          currentLevel = children;
        }
      }
    }
    
    return result;
  }, [initialData, selectedPath]);

  const handleSelect = (node: TreeNode, columnIndex: number) => {
    console.log('🖱️ Selected:', node.name, 'path:', node.path, 'type:', node.type);
    
    // Обрезаем путь до текущей колонки и добавляем новый сегмент
    const newPath = selectedPath.slice(0, columnIndex);
    if (node.hasChildren && node.type !== 'product') {
      newPath.push(node.path);
    }
    
    setSelectedPath(newPath);
  };

  return (
    <div>
      {/* Статистика */}
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Категории:</span>
          <span className={styles.statValue}>{stats.totalCategories}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Спайны:</span>
          <span className={styles.statValue}>{stats.totalSpines}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Товары:</span>
          <span className={styles.statValue}>{stats.totalProducts}</span>
        </div>
      </div>

      {/* Miller Columns */}
      <div className={styles.wrapper}>
        <div className={styles.scroller}>
          {columns.map((nodes, columnIndex) => (
            <Column
              key={`column-${columnIndex}`}
              nodes={nodes}
              onSelect={(node) => handleSelect(node, columnIndex)}
              selectedPath={selectedPath}
              columnIndex={columnIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Column component
function Column({ 
  nodes, 
  onSelect, 
  selectedPath,
  columnIndex 
}: { 
  nodes: TreeNode[]; 
  onSelect: (node: TreeNode) => void;
  selectedPath: string[];
  columnIndex: number;
}) {
  const getRowClass = (node: TreeNode) => {
    const baseClass = styles.row;
    const isSelected = selectedPath[columnIndex] === node.path;
    
    if (isSelected) {
      return `${baseClass} ${styles.selectedRow}`;
    }
    if (node.type === 'spine') return `${baseClass} ${styles.spineRow}`;
    if (node.type === 'product') return `${baseClass} ${styles.productRow}`;
    return baseClass;
  };

  const showArrow = (node: TreeNode) => {
    if (node.type === 'product') return false;
    return node.hasChildren;
  };

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <button className={styles.addBtn}>+</button>
      </div>

      <ul className={styles.list}>
        {nodes.map(node => (
          <li
            key={`${node.type}-${node.id}-${node.path}`}
            className={getRowClass(node)}
            onClick={() => onSelect(node)}
          >
            <span className={styles.label}>{node.name}</span>

            {showArrow(node) && (
              <span className={styles.arrow}>›</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}