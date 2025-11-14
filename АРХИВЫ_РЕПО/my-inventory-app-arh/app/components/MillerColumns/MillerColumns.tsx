// components/MillerColumns/MillerColumns.tsx
'use client';

import { useState } from 'react';
import { Column } from './Column';
import styles from './MillerColumns.module.css';

export type NodeType = 'category' | 'spine' | 'product';

export type MillerNode = {
  id: number;
  name: string;
  slug?: string;
  type: NodeType;
  node_index: string;
  human_path: string;
  hasChildren?: boolean;
  hasProducts?: boolean;
  // Для продуктов
  code?: string;
  brand?: string;
};

type Props = { initialColumns: MillerNode[][] };

export function MillerColumns({ initialColumns }: Props) {
  const [columns, setColumns] = useState<MillerNode[][]>(initialColumns);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelect = async (node: MillerNode, colIdx: number) => {
    // Если это продукт - не загружаем дальше
    if (node.type === 'product') {
      console.log('Selected product:', node);
      return;
    }

    // Если уже загружаем, игнорируем клик
    if (loading) return;

    // Обрезаем всё правее выбранного элемента
    const newCols = columns.slice(0, colIdx + 1);
    
    setLoading(true);

    try {
      const res = await fetch(
        `/api/miller-columns?parentNodeIndex=${encodeURIComponent(node.node_index)}`
      );
      
      if (!res.ok) throw new Error('Failed to fetch');
      
      const children: MillerNode[] = await res.json();
      
      if (children && children.length > 0) {
        newCols.push(children);
        setColumns(newCols);
      } else {
        // Если детей нет, но мы ожидали их - оставляем колонки как есть
        console.log('No children found for:', node.name);
      }
    } catch (error) {
      console.error('Error loading children:', error);
      // В случае ошибки тоже оставляем текущее состояние
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroller}>
        {columns.map((nodes, idx) => (
          <Column
            key={`column-${idx}-${nodes.length}`}
            nodes={nodes}
            onSelect={n => handleSelect(n, idx)}
            isDisabled={loading}
          />
        ))}
        
        {/* Индикатор загрузки только если действительно грузим */}
        {loading && (
          <div className={styles.column}>
            <div className={styles.header}>
              <button className={styles.addBtn} disabled>+</button>
            </div>
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              Загрузка...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}