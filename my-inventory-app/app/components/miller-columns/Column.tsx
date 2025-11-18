'use client'
import { ColumnItem } from './types'
import CategoryCell from './CategoryCell'
import SpineCell from './SpineCell'
import ProductCell from './ProductCell'
import styles from './MillerColumns.module.css'
import { getCreateButtons } from './utils/createButtons'
import { getCellComponent } from './utils/cellComponents'

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
  onCreateProduct?: (spine?: any, category?: any) => void
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
  onCreateSpine,
  onCreateProduct
}: ColumnProps) {

  console.log('🔍 Column received items:', items)
  console.log('🔍 First item details:', items[0])
  console.log('🔍 First item data:', items[0]?.data)
  console.log('🔍 First item name:', items[0]?.data?.name)

  const createButtons = getCreateButtons({
    columnIndex,
    isCollapsed,
    parentType,
    showCreateButtons,
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
            console.log(`🔍 Column mapping item ${index}:`, item)
            console.log(`🔍 Column mapping item.data ${index}:`, item.data)
            console.log(`🔍 Column mapping item.data.name ${index}:`, item.data?.name)
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