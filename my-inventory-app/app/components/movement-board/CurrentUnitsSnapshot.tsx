// components/movement-board/CurrentUnitsSnapshot.tsx
interface CurrentUnitsSnapshotProps {
  product: any
  statusCounts: Record<string, number>
}

export default function CurrentUnitsSnapshot({ product, statusCounts }: CurrentUnitsSnapshotProps) {
  const keyStatuses = ['IN_STORE', 'SOLD', 'IN_REQUEST', 'CANDIDATE']
  const activeStatuses = keyStatuses
    .filter(status => statusCounts[status] > 0)
    .slice(0, 4)

  return (
    <div className="bg-white border border-gray-200 rounded p-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700">{product.code}</span>
          <div className="flex items-center gap-1">
            {activeStatuses.map((status) => (
              <div key={status} className="flex items-center gap-0.5">
                <span className={`text-base ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                </span>
                <span className="text-xs font-medium text-gray-800">
                  {statusCounts[status]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {product.brand?.name}
        </span>
      </div>
    </div>
  )
}

function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    CLEAR: '○', CANDIDATE: '◐', IN_REQUEST: '●', 
    IN_STORE: '□', SOLD: '◧'
  }
  return icons[status] || '○'
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    CLEAR: 'text-gray-400', CANDIDATE: 'text-purple-500', 
    IN_REQUEST: 'text-yellow-500', IN_STORE: 'text-green-500', 
    SOLD: 'text-yellow-300'
  }
  return colors[status] || 'text-gray-400'
}