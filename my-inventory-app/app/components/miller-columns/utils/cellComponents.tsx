// components/miller-columns/utils/cellComponents.tsx
import React from 'react'
import { ColumnItem } from '../types'
import CategoryCell from '../CategoryCell'
import SpineCell from '../SpineCell'
import ProductCell from '../ProductCell'
import styles from '../MillerColumns.module.css'
import { getItemCreateButtons } from './createButtons'

interface CellComponentProps {
  item: ColumnItem
  index: number
  columnIndex: number
  onItemSelect: (item: ColumnItem, columnIndex: number) => void
  isItemSelected: (itemId: number) => boolean
  isCollapsed: boolean
  onCreateCategory?: (parentCategory?: any) => void
  onCreateSpine?: (category: any) => void
  onCreateProduct?: (spine?: any, category?: any) => void
}

export function getCellComponent({
  item,
  index,
  columnIndex,
  onItemSelect,
  isItemSelected,
  isCollapsed,
  onCreateCategory,
  onCreateSpine,
  onCreateProduct
}: CellComponentProps): React.ReactNode {

  console.log('🔍 getCellComponent item:', item.type, item.data?.name)

  // Защита от undefined
  if (!item || !item.data) {
    console.warn('❌ Item or item.data is undefined')
    return (
      <div key={`empty-${index}`} className={styles.millerRow}>
        <div className={styles.millerLabel}>
          <div className="text-gray-400">Ошибка данных</div>
        </div>
      </div>
    )
  }

  const baseProps = {
    onClick: () => onItemSelect(item, columnIndex),
    isSelected: isItemSelected(item.data.id),
    isCollapsed: isCollapsed
  }

  // ОТЛАДКА: проверяем какие функции передаются
  console.log('🔍 getCellComponent - available create functions:', {
    hasOnCreateCategory: !!onCreateCategory,
    hasOnCreateSpine: !!onCreateSpine,
    hasOnCreateProduct: !!onCreateProduct,
    itemType: item.type
  })

  // Обертка с кнопками создания - УБРАНА ЛИШНЯЯ ОБЕРТКА
  const CellWithButtons = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.millerCellWithButtons}>
      {children}
      {/* ПРИНУДИТЕЛЬНО ДЕЛАЕМ КНОПКИ ВИДИМЫМИ */}
      <div style={{ opacity: 1, pointerEvents: 'auto' }}>
        {getItemCreateButtons(item, onCreateCategory, onCreateSpine, onCreateProduct)}
      </div>
    </div>
  )

  switch (item.type) {
    case 'category':
      return (
        <CellWithButtons key={`category-${item.data.id}-${index}`}>
          <CategoryCell 
            item={item.data}
            {...baseProps}
          />
        </CellWithButtons>
      )
    case 'spine':
      return (
        <CellWithButtons key={`spine-${item.data.id}-${index}`}>
          <SpineCell 
            item={item.data}
            {...baseProps}
          />
        </CellWithButtons>
      )
    case 'product':
      return (
        <CellWithButtons key={`product-${item.data.id}-${index}`}>
          <ProductCell 
            item={item.data}
            {...baseProps}
          />
        </CellWithButtons>
      )
    default:
      return null
  }
}