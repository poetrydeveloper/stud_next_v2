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
  // ПОЛНАЯ ЗАЩИТА ОТ UNDEFINED
  if (!item) {
    return (
      <div className={`${styles.millerRow} ${styles.millerSpineRow}`}>
        <div className={styles.millerLabel}>
          <div className="text-gray-400">Загрузка...</div>
        </div>
      </div>
    )
  }

  const _count = item._count || { products: 0, productUnits: 0 }

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
        title={item.name || 'Без названия'}
      >
        <div className={styles.millerLabel}>
          <div className="font-medium truncate">{item.name || 'Без названия'}</div>
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
        <div className="font-medium">{item.name || 'Без названия'}</div>
        <div className="flex items-center gap-3 mt-1 text-xs">
          <span className="flex items-center gap-1 text-green-700">
            <span>📦</span>
            <span>{_count.products} продуктов</span>
          </span>
          <span className="flex items-center gap-1 text-green-700">
            <span>🔢</span>
            <span>{_count.productUnits} единиц</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {showChildrenIndicator && _count.products > 0 && (
          <div className={styles.millerChildrenIndicator} />
        )}
        {_count.products > 0 && (
          <span className={`${styles.millerArrow} text-green-600`}>→</span>
        )}
      </div>
    </div>
  )
}