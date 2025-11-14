// components/miller-columns/CategoryCell.tsx - ОБНОВЛЕННАЯ ВЕРСИЯ
import { CellProps } from './types'
import { Category } from './types'

export default function CategoryCell({ item, onClick, isSelected }: CellProps<Category>) {
  const hasChildren = item._count.children > 0 || item._count.spines > 0

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all active:scale-95 ${
        isSelected 
          ? 'bg-gray-300 border-gray-400 shadow-sm' 
          : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{item.name}</h3>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
            {item._count.children > 0 && (
              <span className="flex items-center gap-1">
                <span>📁</span>
                <span>{item._count.children}</span>
              </span>
            )}
            {item._count.spines > 0 && (
              <span className="flex items-center gap-1">
                <span>🟢</span>
                <span>{item._count.spines}</span>
              </span>
            )}
            {item._count.products > 0 && (
              <span className="flex items-center gap-1">
                <span>📦</span>
                <span>{item._count.products}</span>
              </span>
            )}
          </div>
        </div>
        
        {hasChildren && (
          <div className={`text-lg ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
            →
          </div>
        )}
      </div>
    </div>
  )
}