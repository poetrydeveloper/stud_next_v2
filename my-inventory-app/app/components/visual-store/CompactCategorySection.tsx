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

interface CompactCategorySectionProps {
  categoryName: string
  groups: ProductGroup[]
  onAddToCandidates: (productCode: string, brandName: string) => void
}

export function CompactCategorySection({ categoryName, groups, onAddToCandidates }: CompactCategorySectionProps) {
  return (
    <div className="border-2 border-gray-300 rounded-lg p-3 bg-white mb-4 shadow-sm">
      {/* Заголовок категории */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <h3 className="text-md font-bold flex items-center">
          <span className="text-xl mr-2">📂</span>
          {categoryName}
        </h3>
        <div className="flex gap-2 text-xs">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {groups.length} товаров
          </span>
        </div>
      </div>

      {/* Кругляшки категории - компактная сетка */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1">
        {groups.map(group => (
          <ProductBubble
            key={`${group.productCode}_${group.brandName}`}
            group={group}
            onAddToCandidates={onAddToCandidates}
          />
        ))}
      </div>
    </div>
  )
}