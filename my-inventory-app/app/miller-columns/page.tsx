// app/miller-columns/page.tsx
'use client'

import { useState } from 'react'
import MillerColumns from '@/app/components/miller-columns/MillerColumns'
import ProductMovementDashboard from '@/app/components/movement-board/ProductMovementDashboard' // ← ИЗМЕНИЛ ИМПОРТ

export default function MillerColumnsPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showMovementBoard, setShowMovementBoard] = useState(false)
  const [millerWidth, setMillerWidth] = useState(800) // начальная ширина

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product)
    setShowMovementBoard(true)
  }

  const handleCloseMovementBoard = () => {
    setShowMovementBoard(false)
    setSelectedProduct(null)
  }

  // Обработчик изменения ширины Miller Columns
  const handleMillerWidthChange = (width: number) => {
    setMillerWidth(width + 32) // добавляем отступы
  }

  return (
    <div className="flex h-full">
      {/* Левая панель - Miller Columns */}
      <div 
        className="transition-all duration-300 h-full flex flex-col flex-shrink-0"
        style={{ width: showMovementBoard ? `${millerWidth}px` : '100%' }}
      >
        <div className="h-full bg-white rounded-lg border border-gray-200 flex flex-col">
          {/* УБИРАЕМ заголовок - оставляем только border для визуального разделения */}
          <div className="p-2 border-b border-gray-200 flex-shrink-0">
            {/* Заголовки удалены - оставляем минимальную высоту для border */}
          </div>
          
          <div className="flex-1 min-h-0">
            <MillerColumns 
              onProductSelect={handleProductSelect}
              onWidthChange={handleMillerWidthChange} // передаем обработчик
            />
          </div>
        </div>
      </div>

      {/* Правая панель - Табло движений */}
      {showMovementBoard && (
        <div className="flex-1 transition-all duration-300 h-full min-w-[400px] bg-white border-l border-gray-200">
          <ProductMovementDashboard // ← ИЗМЕНИЛ КОМПОНЕНТ
            product={selectedProduct}
            onClose={handleCloseMovementBoard}
          />
        </div>
      )}
    </div>
  )
}