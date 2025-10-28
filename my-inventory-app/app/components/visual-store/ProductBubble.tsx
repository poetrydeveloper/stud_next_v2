'use client'

import { useState, useRef, useEffect } from 'react'

interface ProductGroup {
  productCode: string
  brandName: string
  categoryName: string
  inStoreCount: number
  inRequestCount: number
  weeklySales: number
  totalCount: number
  color: string
}

interface ProductBubbleProps {
  group: ProductGroup
  onAddToCandidates: (productCode: string, brandName: string) => void
}

export function ProductBubble({ group, onAddToCandidates }: ProductBubbleProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    // Задержка 2 секунды если не над тултипом
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false)
    }, 2000)
  }

  const handleTooltipMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleTooltipMouseLeave = () => {
    // Быстрое скрытие если ушли с тултипа
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false)
    }, 500)
  }

  const handleAddToCandidates = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCandidates(group.productCode, group.brandName)
    setShowTooltip(false)
  }

  const baseSize = Math.max(40, Math.min(120, group.inStoreCount * 15))
  
  const getOrbitStyle = (sales: number) => {
    if (sales === 0) return { width: baseSize, height: baseSize }
    
    const orbitThickness = 8
    const totalOrbitSize = baseSize + (sales * orbitThickness * 2)
    
    const shadows = []
    for (let i = 0; i < sales; i++) {
      const orbitDistance = baseSize + (i * orbitThickness * 2)
      shadows.push(`0 0 0 ${orbitThickness / 2}px black`)
      if (i < sales - 1) {
        shadows.push(`0 0 0 ${orbitThickness}px white`)
      }
    }
    
    return {
      width: totalOrbitSize,
      height: totalOrbitSize,
      boxShadow: shadows.join(', ')
    }
  }

  const requestIndicatorStyle = group.inRequestCount > 0 ? {
    borderBottom: '3px solid #3b82f6',
  } : {}

  const orbitStyle = getOrbitStyle(group.weeklySales)

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`rounded-full flex items-center justify-center cursor-pointer relative
          ${group.color === 'red' ? 'bg-red-400' : ''}
          ${group.color === 'yellow' ? 'bg-yellow-400' : ''}
          ${group.color === 'green' ? 'bg-green-400' : ''}
        `}
        style={{
          width: baseSize,
          height: baseSize,
          ...requestIndicatorStyle,
          ...orbitStyle
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onAddToCandidates(group.productCode, group.brandName)}
      >
        <span className="text-white font-bold text-sm">
          {group.inStoreCount}
        </span>
        
        {group.inRequestCount > 0 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      {showTooltip && (
        <div 
          ref={tooltipRef}
          className="absolute z-10 bg-white p-3 rounded shadow-lg border -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full min-w-48"
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <div className="text-sm font-semibold mb-2">
            {group.brandName} - {group.productCode}
          </div>
          <div className="space-y-1 text-xs">
            <div>📦 В наличии: <strong>{group.inStoreCount} шт.</strong></div>
            <div>📥 В заказе: <strong>{group.inRequestCount} шт.</strong></div>
            <div>💰 Продано за неделю: <strong>{group.weeklySales} шт.</strong></div>
            <div>🎯 Светофор: 
              <span className={`ml-1 inline-block w-3 h-3 rounded-full ${
                group.color === 'red' ? 'bg-red-500' : 
                group.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></span>
            </div>
          </div>
          <button
            className="mt-2 w-full bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
            onClick={handleAddToCandidates}
          >
            ➕ Добавить в кандидаты
          </button>
          
          {/* Индикатор что тултип скоро исчезнет */}
          <div className="mt-2 text-xs text-gray-400 text-center">
            исчезнет через 2 сек...
          </div>
        </div>
      )}
    </div>
  )
}