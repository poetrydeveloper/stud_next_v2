// components/MillerColumns/Column.tsx
'use client';

import { useRef, useEffect } from 'react';
import { MillerNode } from './MillerColumns';
import styles from './MillerColumns.module.css';

type Props = {
  nodes: MillerNode[];
  onSelect: (node: MillerNode) => void;
  isDisabled?: boolean;
};

export function Column({ nodes, onSelect, isDisabled }: Props) {
  const columnRef = useRef<HTMLDivElement>(null);
  
  // Синхронная прокрутка
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const scrollTop = target.scrollTop;
      
      // Прокручиваем все колонки кроме текущей
      document.querySelectorAll(`.${styles.column}`).forEach(el => {
        if (el !== target) {
          (el as HTMLDivElement).scrollTop = scrollTop;
        }
      });
    };

    const column = columnRef.current;
    if (column) {
      column.addEventListener('scroll', handleScroll);
      return () => column.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const getRowClass = (node: MillerNode) => {
    const baseClass = styles.row;
    if (isDisabled) return `${baseClass} ${styles.disabled}`;
    if (node.type === 'spine') return `${baseClass} ${styles.spineRow}`;
    if (node.type === 'product') return `${baseClass} ${styles.productRow}`;
    return baseClass;
  };

  const showArrow = (node: MillerNode) => {
    if (node.type === 'product') return false;
    if (node.type === 'category') return node.hasChildren;
    if (node.type === 'spine') return node.hasProducts;
    return false;
  };

  const handleClick = (node: MillerNode) => {
    if (!isDisabled) {
      onSelect(node);
    }
  };

  return (
    <div ref={columnRef} className={styles.column}>
      <div className={styles.header}>
        <button 
          className={styles.addBtn} 
          disabled={isDisabled}
        >
          +
        </button>
      </div>

      <ul className={styles.list}>
        {nodes.map(node => (
          <li
            key={`${node.type}-${node.id}`}
            className={getRowClass(node)}
            onClick={() => handleClick(node)}
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