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

interface CategorySectionProps {
  categoryName: string
  groups: ProductGroup[]
  onAddToCandidates: (productCode: string, brandName: string) => void
}

export function CategorySection({ categoryName, groups, onAddToCandidates }: CategorySectionProps) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="text-2xl mr-2">📂</span>
        {categoryName}
        <span className="ml-2 text-sm text-gray-500 bg-white px-2 py-1 rounded">
          {groups.length} товаров
        </span>
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
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