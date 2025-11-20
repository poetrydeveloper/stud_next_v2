// components/movement-board/CurrentUnitsSnapshot.tsx - КОМПАКТНЫЙ
interface CurrentUnitsSnapshotProps {
  product: any
  statusCounts: Record<string, number>
}

export default function CurrentUnitsSnapshot({ product, statusCounts }: CurrentUnitsSnapshotProps) {
  const activeStatuses = Object.entries(statusCounts)
    .filter(([_, count]) => count > 0)
    .slice(0, 6) // Ограничиваем до 6 статусов

  return (
    <div className="bg-gray-50 rounded p-2">
      <h3 className="font-semibold text-gray-800 text-xs mb-2">Текущий срез</h3>
      
      {/* Компактная информация о продукте */}
      <div className="grid grid-cols-2 gap-1 text-xs mb-2">
        <div>
          <span className="text-gray-600">Код:</span>
          <p className="font-medium truncate">{product.code}</p>
        </div>
        <div>
          <span className="text-gray-600">Бренд:</span>
          <p className="font-medium truncate">{product.brand?.name || '-'}</p>
        </div>
      </div>

      {/* Компактные иконки статусов в сетке 3x2 */}
      <div className="grid grid-cols-3 gap-1">
        {activeStatuses.map(([status, count]) => (
          <div key={status} className="flex items-center gap-1 p-1 bg-white rounded border border-gray-200 text-xs">
            <span className={getStatusColor(status)}>{getStatusIcon(status)}</span>
            <span className="font-medium text-gray-800">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ПРОСТЫЕ ФУНКЦИИ БЕЗ СЛОЖНОЙ ЛОГИКИ
function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    CLEAR: '○', CANDIDATE: '◐', SPROUTED: '●', IN_REQUEST: '●', 
    IN_DELIVERY: '●', ARRIVED: '□', IN_STORE: '□', SOLD: '◧', 
    CREDIT: '◧', LOST: '◧'
  }
  return icons[status] || '○'
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    CLEAR: 'text-gray-400', CANDIDATE: 'text-purple-500', SPROUTED: 'text-gray-800',
    IN_REQUEST: 'text-yellow-500', IN_DELIVERY: 'text-yellow-600', ARRIVED: 'text-green-500',
    IN_STORE: 'text-green-600', SOLD: 'text-yellow-300', CREDIT: 'text-red-600', 
    LOST: 'text-blue-500'
  }
  return colors[status] || 'text-gray-400'
}