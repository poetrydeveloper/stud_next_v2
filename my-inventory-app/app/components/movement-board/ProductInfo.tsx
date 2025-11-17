// components/movement-board/ProductInfo.tsx - ИСПРАВЛЕННЫЙ
import { Product } from '@/app/components/miller-columns/types'
import StatusBadge from './StatusBadge' // ← ДОБАВИТЬ ИМПОРТ

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-gray-800 mb-3">Информация о продукте</h3>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600">Код:</span>
          <p className="font-medium">{product.code}</p>
        </div>
        
        <div>
          <span className="text-gray-600">Бренд:</span>
          <p className="font-medium">{product.brand.name}</p>
        </div>
        
        <div className="col-span-2">
          <span className="text-gray-600">Описание:</span>
          <p className="font-medium">{product.description || 'Нет описания'}</p>
        </div>
      </div>

      {/* Статистика по статусам */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Статистика единиц:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(product.statusCounts).map(([status, count]) => (
            count > 0 && (
              <StatusBadge key={status} status={status} count={count} />
            )
          ))}
        </div>
      </div>
    </div>
  )
}