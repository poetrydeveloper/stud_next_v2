// components/miller-columns/ProductCell.tsx - ОБНОВЛЕННАЯ ВЕРСИЯ
import { CellProps } from './types'
import { Product } from './types'

export default function ProductCell({ item, onClick, isSelected }: CellProps<Product>) {
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

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all active:scale-95 ${
        isSelected 
          ? 'bg-yellow-200 border-yellow-400 shadow-sm' 
          : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{item.code}</p>
          <p className="text-xs text-gray-500 mt-1">Бренд: {item.brand.name}</p>
          
          {/* Статусы */}
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(item.statusCounts)
              .filter(([_, count]) => count > 0)
              .slice(0, 3) // Показываем только первые 3 статуса
              .map(([status, count]) => (
                <div
                  key={status}
                  className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(status)}`}
                  title={status}
                >
                  {count}
                </div>
              ))
            }
            {Object.keys(item.statusCounts).filter(key => item.statusCounts[key] > 0).length > 3 && (
              <div className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-600">
                +{Object.keys(item.statusCounts).filter(key => item.statusCounts[key] > 0).length - 3}
              </div>
            )}
          </div>
        </div>
        
        <div className={`text-lg ${isSelected ? 'text-yellow-700' : 'text-yellow-600'}`}>
          👁️
        </div>
      </div>
    </div>
  )
}