// components/miller-columns/SpineCell.tsx - ОБНОВЛЕННАЯ ВЕРСИЯ
import { CellProps } from './types'
import { Spine } from './types'

export default function SpineCell({ item, onClick, isSelected }: CellProps<Spine>) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all active:scale-95 ${
        isSelected 
          ? 'bg-green-200 border-green-400 shadow-sm' 
          : 'bg-green-50 border-green-200 hover:bg-green-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{item.name}</h3>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span>📦</span>
              <span>{item._count.products} продуктов</span>
            </span>
            <span className="flex items-center gap-1">
              <span>🔢</span>
              <span>{item._count.productUnits} единиц</span>
            </span>
          </div>
        </div>
        
        <div className={`text-lg ${isSelected ? 'text-green-700' : 'text-green-600'}`}>
          →
        </div>
      </div>
    </div>
  )
}