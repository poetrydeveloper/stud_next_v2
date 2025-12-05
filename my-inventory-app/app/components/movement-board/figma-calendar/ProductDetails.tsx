// app/components/movement-board/figma-calendar/ProductDetails.tsx
import React from 'react'
import { ProductUnit } from './types'
import { StatusIcon, getStatusLabel } from './StatusIcon'

interface ProductDetailsProps {
  products: ProductUnit[]
  selectedDate: Date | null
}

export default function ProductDetails({ products, selectedDate }: ProductDetailsProps) {
  if (!selectedDate) {
    return (
      <div className="empty-state text-center py-12 text-gray-500 text-sm">
        Select a date to view product details
      </div>
    )
  }

  const productsOnDate = products.filter((product) =>
    product.statusHistory.some(
      (history) => history.date.toDateString() === selectedDate.toDateString()
    )
  )

  if (productsOnDate.length === 0) {
    return (
      <div className="empty-state text-center py-12 text-gray-500 text-sm">
        No product activity on this date
      </div>
    )
  }

  return (
    <div className="product-list flex flex-col gap-3">
      {productsOnDate.map((product) => {
        const statusOnDate = product.statusHistory.find(
          (history) => history.date.toDateString() === selectedDate.toDateString()
        )

        if (!statusOnDate) return null

        return (
          <div key={product.id} className="product-item p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="product-header flex justify-between items-start mb-2">
              <div>
                <div className="product-name text-sm font-medium text-gray-900">
                  {product.name}
                </div>
                <div className="product-id text-xs text-gray-500">
                  {product.id}
                </div>
              </div>
              <div className="product-badge flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs">
                <StatusIcon status={statusOnDate.status} size={10} />
                <span>{getStatusLabel(statusOnDate.status)}</span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="product-timeline mt-3 pt-3 border-t border-gray-200">
              <div className="timeline-label text-xs text-gray-500 mb-2">
                Status History:
              </div>
              <div className="timeline-items flex gap-2 overflow-x-auto">
                {product.statusHistory.map((history, idx) => (
                  <div
                    key={idx}
                    className={`
                      timeline-item flex items-center gap-1 px-2 py-1 rounded text-xs
                      ${history.date.toDateString() === selectedDate.toDateString()
                        ? 'active bg-blue-100 border border-blue-300'
                        : 'bg-gray-200'
                      }
                    `}
                  >
                    <StatusIcon status={history.status} size={8} />
                    <span className="text-[10px] whitespace-nowrap">
                      {history.date.toLocaleDateString("en-US", { 
                        month: "short", 
                        day: "numeric" 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}