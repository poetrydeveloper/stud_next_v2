'use client'

import { ProductBubble } from './ProductBubble'

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

interface CompactVisualizationProps {
  productGroups: ProductGroup[]
  onAddToCandidates: (productCode: string, brandName: string) => void
}

export function CompactVisualization({ productGroups, onAddToCandidates }: CompactVisualizationProps) {
  // Группируем товары по категориям
  const groupsByCategory = productGroups.reduce((acc, group) => {
    const category = group.categoryName || 'Без категории'
    if (!acc[category]) acc[category] = []
    acc[category].push(group)
    return acc
  }, {} as Record<string, ProductGroup[]>)

  // Цвета фона для разных категорий
  const categoryColors = [
    'bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-purple-50', 
    'bg-pink-50', 'bg-indigo-50', 'bg-orange-50', 'bg-teal-50',
    'bg-red-50', 'bg-cyan-50', 'bg-lime-50', 'bg-amber-50'
  ]

  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
      {/* ОБЩИЙ КОНТЕЙНЕР С FLEX И ПЕРЕНАСЫВАНИЕМ */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(groupsByCategory).map(([categoryName, groups], categoryIndex) => (
          <div
            key={categoryName}
            className={`relative rounded-lg p-3 ${categoryColors[categoryIndex % categoryColors.length]} border border-gray-200 inline-block max-w-full`}
          >
            {/* Подпись категории на заднем плане */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-lg">
              <span className="text-4xl font-bold text-gray-200 opacity-20 select-none whitespace-nowrap">
                {categoryName.toUpperCase()}
              </span>
            </div>
            
            {/* Заголовок категории */}
            <div className="relative z-10 flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center bg-white bg-opacity-80 px-2 py-1 rounded">
                <span className="text-lg mr-1">📂</span>
                {categoryName}
                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                  {groups.length} шт.
                </span>
              </h3>
            </div>

            {/* КРУЖОЧКИ В FLEX КОНТЕЙНЕРЕ БЕЗ ГРИДА */}
            <div className="relative z-10 flex flex-wrap gap-1">
              {groups.map(group => (
                <ProductBubble
                  key={`${group.productCode}_${group.brandName}`}
                  group={group}
                  onAddToCandidates={onAddToCandidates}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}