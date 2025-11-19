// components/miller-columns/utils/columnUtils.ts
import { ColumnItem } from '../types'

export function getParentTypeForColumn(
  columns: ColumnItem[][], 
  selectedItems: number[], 
  columnIndex: number
): 'category' | 'spine' | null {
  if (columnIndex === 0) return null // корневая колонка
  
  const parentColumnIndex = columnIndex - 1
  if (parentColumnIndex < 0 || !columns[parentColumnIndex] || columns[parentColumnIndex].length === 0) {
    return null
  }
  
  // Находим выбранный элемент в родительской колонке
  const selectedItemId = selectedItems[parentColumnIndex]
  const parentItem = columns[parentColumnIndex].find(item => item.data.id === selectedItemId)
  
  console.log('🔍 getParentTypeForColumn UTILS:', {
    columnIndex,
    parentColumnIndex,
    selectedItemId,
    parentItemType: parentItem?.type,
    parentItemName: parentItem?.data?.name
  })
  
  if (parentItem?.type === 'category') return 'category'
  if (parentItem?.type === 'spine') return 'spine'
  
  return null
}

export function isColumnCollapsed(collapsedColumns: number[], columnIndex: number): boolean {
  return collapsedColumns.includes(columnIndex)
}

export function shouldShowCreateButtons(
  columns: ColumnItem[][], 
  columnIndex: number, 
  isLastColumn: boolean
): boolean {
  return isLastColumn && columns[columnIndex] && columns[columnIndex].length > 0
}