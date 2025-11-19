// components/miller-columns/Column.tsx
'use client'
import { ColumnItem } from './types'
import CategoryCell from './CategoryCell'
import SpineCell from './SpineCell'
import ProductCell from './ProductCell'
import styles from './MillerColumns.module.css'
import { getCreateButtons } from './utils/createButtons'
import { getCellComponent } from './utils/cellComponents'
import { getParentTypeForColumn, shouldShowCreateButtons } from './utils/columnUtils'

interface ColumnProps {
  items: ColumnItem[]
  columnIndex: number
  onItemSelect: (item: ColumnItem, columnIndex: number) => void
  onColumnReset: (columnIndex: number) => void
  isLastColumn: boolean
  isItemSelected: (itemId: number) => boolean
  isActive?: boolean
  isCollapsed?: boolean
  showCreateButtons?: boolean
  onCreateCategory?: (parentCategory?: any) => void
  onCreateSpine?: (category: any) => void
  onCreateProduct?: (spine?: any, category?: any) => void
  // ДОБАВЛЯЕМ необходимые данные для вычислений
  allColumns?: ColumnItem[][]
  selectedItems?: number[]
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
  showCreateButtons = false,
  onCreateCategory,
  onCreateSpine,
  onCreateProduct,
  // Новые props
  allColumns = [],
  selectedItems = []
}: ColumnProps) {

  // ВЫЧИСЛЯЕМ parentType на основе данных
  const parentType = getParentTypeForColumn(allColumns, selectedItems, columnIndex)
  const actualShowCreateButtons = shouldShowCreateButtons(allColumns, columnIndex, isLastColumn)

  console.log('🔍 Column UTILS DEBUG:', {
    columnIndex,
    parentType,
    showCreateButtons: actualShowCreateButtons,
    itemsCount: items.length,
    firstItemType: items[0]?.type,
    allColumnsLength: allColumns.length,
    selectedItems
  })

  const createButtons = getCreateButtons({
    columnIndex,
    isCollapsed,
    parentType,
    showCreateButtons: actualShowCreateButtons,
    onCreateCategory,
    onCreateSpine,
    onCreateProduct
  })

  return (
    <div className={`${styles.millerColumn} ${isCollapsed ? styles.collapsed : ''} ${isActive ? styles.millerColumnActive : ''}`}>
      {createButtons}

      <div className={styles.millerList}>
        {items.length === 0 && !isCollapsed ? (
          <div className={styles.millerEmptyState}>
            <div className={styles.millerEmptyIcon}>📁</div>
            <div className={styles.millerEmptyText}>
              Нет элементов
            </div>
          </div>
        ) : (
          items.map((item, index) => {
            return getCellComponent({
              item,
              index,
              columnIndex,
              onItemSelect,
              isItemSelected,
              isCollapsed,
              onCreateCategory,
              onCreateSpine,
              onCreateProduct
            })
          })
        )}
      </div>

      {!isCollapsed && (
        <div className={styles.millerStatusBar}>
          <span className={styles.millerItemCount}>{items.length}</span>
        </div>
      )}
    </div>
  )
}