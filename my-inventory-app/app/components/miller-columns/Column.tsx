// components/miller-columns/Column.tsx
'use client'

import { ColumnItem } from './types'
import CategoryCell from './CategoryCell'
import SpineCell from './SpineCell'
import ProductCell from './ProductCell'

interface ColumnProps {
  items: ColumnItem[]
  columnIndex: number
  onItemSelect: (item: ColumnItem, columnIndex: number) => void
  onColumnReset: (columnIndex: number) => void
  isLastColumn: boolean
  isItemSelected: (itemId: number) => boolean
}

export default function Column({ 
  items, 
  columnIndex, 
  onItemSelect, 
  onColumnReset,
  isLastColumn,
  isItemSelected
}: ColumnProps) {
  const getCellComponent = (item: ColumnItem, index: number) => {
    const commonProps = {
      item: item.data,
      onClick: () => onItemSelect(item, columnIndex),
      isSelected: isItemSelected(item.data.id)
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
    <div className="w-80 border-r border-gray-200 bg-gray-50 flex-shrink-0 flex flex-col">
      {/* Заголовок колонки */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Уровень {columnIndex + 1}
          </span>
          {columnIndex > 0 && (
            <button
              onClick={() => onColumnReset(columnIndex - 1)}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
            >
              Назад
            </button>
          )}
        </div>
      </div>

      {/* Список элементов */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-2">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">
              Нет элементов для отображения
            </div>
          ) : (
            items.map((item, index) => getCellComponent(item, index))
          )}
        </div>
      </div>

      {/* Статус бар */}
      <div className="p-2 border-t border-gray-200 bg-white text-xs text-gray-500">
        {items.length} элементов
      </div>
    </div>
  )
}