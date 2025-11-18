import { ColumnItem } from '../types'

interface UseCellComponentsProps {
  columnIndex: number
  onItemSelect: (item: ColumnItem, columnIndex: number) => void
  isItemSelected: (itemId: number) => boolean
  isCollapsed: boolean
}

export function useCellComponents({
  columnIndex,
  onItemSelect,
  isItemSelected,
  isCollapsed
}: UseCellComponentsProps) {

  const getCellProps = (item: ColumnItem, index: number) => {
    // Защита от undefined
    if (!item || !item.data) {
      return null
    }

    return {
      key: `${item.type}-${item.data.id}-${index}`,
      baseProps: {
        onClick: () => onItemSelect(item, columnIndex),
        isSelected: isItemSelected(item.data.id),
        isCollapsed: isCollapsed
      },
      item
    }
  }

  return {
    getCellProps
  }
}