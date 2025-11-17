// components/movement-board/MovementBoard.tsx - ИСПРАВЛЕННЫЙ
'use client'

import { Product } from '@/app/components/miller-columns/types'
import ProductInfo from './ProductInfo'
import Timeline from './Timeline' // ← ДОБАВИТЬ ИМПОРТ
import ActionButtons from './ActionButtons' // ← ДОБАВИТЬ ИМПОРТ

interface MovementBoardProps {
  product: Product
  onClose: () => void
}

export default function MovementBoard({ product, onClose }: MovementBoardProps) {
  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Заголовок */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Табло движений</h2>
            <p className="text-sm text-gray-600">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 p-4 overflow-y-auto">
        <ProductInfo product={product} />
        <Timeline product={product} />
        <ActionButtons product={product} />
      </div>
    </div>
  )
}