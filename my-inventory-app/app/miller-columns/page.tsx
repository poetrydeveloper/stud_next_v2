// app/miller-columns/page.tsx
'use client'

import { useState } from 'react'
import MillerColumns from '@/app/components/miller-columns/MillerColumns'
import MovementBoard from '@/app/components/movement-board/MovementBoard'

export default function MillerColumnsPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showMovementBoard, setShowMovementBoard] = useState(false)

  // Обработчик выбора продукта в Miller Columns
  const handleProductSelect = (product: any) => {
    setSelectedProduct(product)
    setShowMovementBoard(true)
  }

  // Закрытие табло движений
  const handleCloseMovementBoard = () => {
    setShowMovementBoard(false)
    setSelectedProduct(null)
  }

  return (
    <div className="h-full"> {/* УБИРАЕМ flex здесь */}
      {/* Основная область - Miller Columns */}
      <div className={`${showMovementBoard ? 'w-2/3 float-left' : 'w-full'} transition-all duration-300 h-full`}>
        <div className="h-full bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">🗂️ Карта товаров</h1>
            <p className="text-sm text-gray-600 mt-1">
              Навигация по категориям → Spine → Продукты
            </p>
          </div>
          
          {/* УБИРАЕМ лишнюю обертку с flex */}
          <MillerColumns onProductSelect={handleProductSelect} />
        </div>
      </div>

      {/* Табло движений - выезжает справа */}
      {showMovementBoard && (
        <div className="w-1/3 float-left transition-all duration-300 h-full">
          <MovementBoard 
            product={selectedProduct}
            onClose={handleCloseMovementBoard}
          />
        </div>
      )}
    </div>
  )
}