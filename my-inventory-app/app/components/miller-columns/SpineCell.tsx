// components/miller-columns/SpineCell.tsx - ОБНОВЛЕННЫЙ
import { CellProps } from './types'
import { Spine } from './types'
import styles from './MillerColumns.module.css'

export default function SpineCell({ 
  item, 
  onClick, 
  isSelected, 
  showChildrenIndicator = false,
  isCollapsed = false 
}: CellProps<Spine> & { showChildrenIndicator?: boolean; isCollapsed?: boolean }) {
  const getRowClass = () => {
    const baseClass = `${styles.millerRow} ${styles.millerSpineRow}`
    const selectedClass = isSelected ? styles.millerSpineRowSelected : ''
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
        <div className="flex items-center gap-3 mt-1 text-xs">
          <span className="flex items-center gap-1 text-green-700">
            <span>📦</span>
            <span>{item._count.products} продуктов</span>
          </span>
          <span className="flex items-center gap-1 text-green-700">
            <span>🔢</span>
            <span>{item._count.productUnits} единиц</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {showChildrenIndicator && item._count.products > 0 && (
          <div className={styles.millerChildrenIndicator} />
        )}
        {item._count.products > 0 && (
          <span className={`${styles.millerArrow} text-green-600`}>→</span>
        )}
      </div>
    </div>
  )
}