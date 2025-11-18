import { CellProps } from './types'
import { Product } from './types'
import styles from './MillerColumns.module.css'

export default function ProductCell({ 
  item, 
  onClick, 
  isSelected,
  isCollapsed = false 
}: CellProps<Product> & { isCollapsed?: boolean }) {
  // ПОЛНАЯ ЗАЩИТА ОТ UNDEFINED
  if (!item) {
    return (
      <div className={`${styles.millerRow} ${styles.millerProductRow}`}>
        <div className={styles.millerLabel}>
          <div className="text-gray-400">Загрузка...</div>
        </div>
      </div>
    )
  }

  const _count = item._count || { productUnits: 0 }

  const getRowClass = () => {
    const baseClass = `${styles.millerRow} ${styles.millerProductRow}`
    const selectedClass = isSelected ? styles.millerProductRowSelected : ''
    const collapsedClass = isCollapsed ? styles.collapsedRow : ''
    return `${baseClass} ${selectedClass} ${collapsedClass}`
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      CLEAR: 'bg-gray-400',
      CANDIDATE: 'bg-purple-500',
      SPROUTED: 'bg-black',
      IN_REQUEST: 'bg-yellow-500',
      IN_DELIVERY: 'bg-blue-400',
      ARRIVED: 'bg-green-400',
      IN_STORE: 'bg-green-500',
      SOLD: 'bg-yellow-300',
      CREDIT: 'bg-red-500',
      LOST: 'bg-blue-500'
    }
    return colors[status] || 'bg-gray-300'
  }

  const getStatusName = (status: string) => {
    const names: Record<string, string> = {
      CLEAR: 'Чистый',
      CANDIDATE: 'Кандидат',
      SPROUTED: 'Росток',
      IN_REQUEST: 'В заявке',
      IN_DELIVERY: 'Доставка',
      ARRIVED: 'Прибыл',
      IN_STORE: 'В магазине',
      SOLD: 'Продан',
      CREDIT: 'Кредит',
      LOST: 'Потерян'
    }
    return names[status] || status
  }

  // Создаем статусы из productUnits если statusCounts нет
  const getStatusCounts = () => {
    if (item.statusCounts && Object.keys(item.statusCounts).length > 0) {
      return item.statusCounts
    }
    
    // Создаем статусы из productUnits
    const counts: Record<string, number> = {}
    if (item.productUnits) {
      item.productUnits.forEach(unit => {
        const status = unit.statusCard || unit.statusProduct
        if (status) {
          counts[status] = (counts[status] || 0) + 1
        }
      })
    }
    return counts
  }

  const statusCounts = getStatusCounts()
  const activeStatuses = Object.entries(statusCounts)
    .filter(([_, count]) => count > 0)
    .slice(0, 3)

  // В свернутом состоянии показываем только название
  if (isCollapsed) {
    return (
      <div
        onClick={onClick}
        className={getRowClass()}
        title={`${item.name || 'Без названия'} (${item.code || 'без кода'})`}
      >
        <div className={styles.millerLabel}>
          <div className="font-medium truncate">{item.name || 'Без названия'}</div>
        </div>
      </div>
    )
  }

  // Полноценное отображение
  return (
    <div
      onClick={onClick}
      className={getRowClass()}
    >
      <div className={styles.millerLabel}>
        <div className="font-medium">{item.name || 'Без названия'}</div>
        <div className="text-sm text-gray-600 mt-1">Арт: {item.code || 'без кода'}</div>
        <div className="text-xs text-gray-500 mt-1">
          Бренд: {item.brand?.name || 'Не указан'}
        </div>
        
        {/* Статусы */}
        {activeStatuses.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {activeStatuses.map(([status, count]) => (
              <div
                key={status}
                className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(status)}`}
                title={`${getStatusName(status)}: ${count} ед.`}
              >
                {count}
              </div>
            ))}
            {Object.keys(statusCounts).filter(key => statusCounts[key] > 0).length > 3 && (
              <div 
                className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-600"
                title="Еще статусы..."
              >
                +{Object.keys(statusCounts).filter(key => statusCounts[key] > 0).length - 3}
              </div>
            )}
          </div>
        )}
        
        {/* Если нет статусов, показываем общее количество */}
        {activeStatuses.length === 0 && _count.productUnits > 0 && (
          <div className="text-xs text-gray-500 mt-2">
            Всего единиц: {_count.productUnits}
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <span className={`${styles.millerArrow} text-yellow-600`}>👁️</span>
      </div>
    </div>
  )
}