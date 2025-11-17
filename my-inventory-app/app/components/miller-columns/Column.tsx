// components/miller-columns/Column.tsx - ОБНОВЛЕННЫЙ С ЭФФЕКТОМ СМИНАНИЯ
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
  showCreateButtons = false
}: ColumnProps) {
  const getCellComponent = (item: ColumnItem, index: number) => {
    const commonProps = {
      item: item.data,
      onClick: () => onItemSelect(item, columnIndex),
      isSelected: isItemSelected(item.data.id),
      showChildrenIndicator: item.type !== 'product' && item.data.hasChildren,
      isCollapsed: isCollapsed // Передаем состояние сминания в ячейки
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

  // Определяем какие кнопки создания показывать
  const getCreateButtons = () => {
    if (!showCreateButtons || isCollapsed) return null // Не показываем кнопки в свернутом состоянии

    if (columnIndex === 0) {
      return (
        <div className={styles.millerCreateButtons}>
          <button className={styles.millerCreateBtn}>
            + Категория
          </button>
        </div>
      )
    }

    if (parentType === 'category') {
      return (
        <div className={styles.millerCreateButtons}>
          <button className={styles.millerCreateBtn}>
            + Категория
          </button>
          <button className={styles.millerCreateBtn}>
            + Spine
          </button>
        </div>
      )
    }

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

  return (
    <div className={`${styles.millerColumn} ${isCollapsed ? styles.collapsed : ''} ${isActive ? styles.millerColumnActive : ''}`}>
      {/* Кнопки создания вместо заголовка */}
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