// components/miller-columns/Column.tsx - ИСПРАВЛЕННЫЙ
'use client'

import { ColumnItem } from './types'
import CategoryCell from './CategoryCell'
import SpineCell from './SpineCell'
import ProductCell from './ProductCell'
import styles from './MillerColumns.module.css'

interface ColumnProps {
  items: ColumnItem[]
  columnIndex: number
  onItemSelect: (item: ColumnItem, columnIndex: number) => void
  onColumnReset: (columnIndex: number) => void
  isLastColumn: boolean
  isItemSelected: (itemId: number) => boolean
  isActive?: boolean
  isCollapsed?: boolean
  parentType?: 'category' | 'spine' | null
  showCreateButtons?: boolean
  onCreateCategory?: (parentCategory?: any) => void
  onCreateSpine?: (category: any) => void
}

export default function Column({ 
  items, 
  columnIndex, 
  onItemSelect, 
  onColumnReset,
  isLastColumn,
  isItemSelected,
  isActive = false,
  isCollapsed = false,
  parentType,
  showCreateButtons = false,
  onCreateCategory,
  onCreateSpine
}: ColumnProps) {

  // ФУНКЦИЯ ДЛЯ КНОПОК СОЗДАНИЯ
  const getCreateButtons = () => {
    if (isCollapsed) return null

    // КОРНЕВАЯ КОЛОНКА
    if (columnIndex === 0) {
      return (
        <div className={styles.millerCreateButtons}>
          <button 
            className={styles.millerCreateBtn}
            onClick={() => onCreateCategory?.()}
          >
            + Категория
          </button>
        </div>
      )
    }

    if (!showCreateButtons) return null

    // КОЛОНКА КАТЕГОРИИ
    if (parentType === 'category') {
      const parentItem = items.find(item => isItemSelected(item.data.id))
      return (
        <div className={styles.millerCreateButtons}>
          <button 
            className={styles.millerCreateBtn}
            onClick={() => onCreateCategory?.(parentItem?.data)}
          >
            + Категория
          </button>
          <button 
            className={styles.millerCreateBtn}
            onClick={() => onCreateSpine?.(parentItem?.data)}
          >
            + Spine
          </button>
        </div>
      )
    }

    // КОЛОНКА SPINE
    if (parentType === 'spine') {
      return (
        <div className={styles.millerCreateButtons}>
          <button className={styles.millerCreateBtn}>
            + Продукт
          </button>
        </div>
      )
    }

    return null
  }

  const getCellComponent = (item: ColumnItem, index: number) => {
    const commonProps = {
      item: item.data,
      onClick: () => onItemSelect(item, columnIndex),
      isSelected: isItemSelected(item.data.id),
      showChildrenIndicator: item.type !== 'product' && item.data.hasChildren,
      isCollapsed: isCollapsed
    }

    switch (item.type) {
      case 'category':
        return (
          <CategoryCell 
            key={`category-${item.data.id}-${index}`}
            {...commonProps} 
          />
        )
      case 'spine':
        return (
          <SpineCell 
            key={`spine-${item.data.id}-${index}`}
            {...commonProps} 
          />
        )
      case 'product':
        return (
          <ProductCell 
            key={`product-${item.data.id}-${index}`}
            {...commonProps} 
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={`${styles.millerColumn} ${isCollapsed ? styles.collapsed : ''} ${isActive ? styles.millerColumnActive : ''}`}>
      {/* Кнопки создания */}
      {getCreateButtons()}

      {/* Список элементов */}
      <div className={styles.millerList}>
        {items.length === 0 && !isCollapsed ? (
          <div className={styles.millerEmptyState}>
            <div className={styles.millerEmptyIcon}>📁</div>
            <div className={styles.millerEmptyText}>
              Нет элементов
            </div>
          </div>
        ) : (
          items.map((item, index) => getCellComponent(item, index))
        )}
      </div>

      {/* Статус бар */}
      {!isCollapsed && (
        <div className={styles.millerStatusBar}>
          <span className={styles.millerItemCount}>{items.length}</span>
        </div>
      )}
    </div>
  )
}