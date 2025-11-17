// components/miller-columns/CategoryCell.tsx - ОБНОВЛЕННЫЙ
import { CellProps } from './types'
import { Category } from './types'
import styles from './MillerColumns.module.css'

export default function CategoryCell({ 
  item, 
  onClick, 
  isSelected, 
  showChildrenIndicator = false,
  isCollapsed = false 
}: CellProps<Category> & { showChildrenIndicator?: boolean; isCollapsed?: boolean }) {
  const hasChildren = item._count.children > 0 || item._count.spines > 0

  const getRowClass = () => {
    const baseClass = styles.millerRow
    const selectedClass = isSelected ? styles.millerRowSelected : ''
    const collapsedClass = isCollapsed ? styles.collapsedRow : ''
    return `${baseClass} ${selectedClass} ${collapsedClass}`
  }

  if (isCollapsed) {
    return (
      <div
        onClick={onClick}
        className={getRowClass()}
        title={item.name}
      >
        <div className={styles.millerLabel}>
          <div className="font-medium truncate">{item.name}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={getRowClass()}
    >
      <div className={styles.millerLabel}>
        <div className="font-medium">{item.name}</div>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
          {item._count.children > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-blue-500">📁</span>
              <span>{item._count.children} подкат.</span>
            </span>
          )}
          {item._count.spines > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-green-500">🟢</span>
              <span>{item._count.spines} spine</span>
            </span>
          )}
          {item._count.products > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">📦</span>
              <span>{item._count.products} прод.</span>
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {showChildrenIndicator && hasChildren && (
          <div className={styles.millerChildrenIndicator} />
        )}
        {hasChildren && (
          <span className={styles.millerArrow}>→</span>
        )}
      </div>
    </div>
  )
}