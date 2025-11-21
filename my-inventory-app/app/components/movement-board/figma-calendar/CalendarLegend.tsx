// legend content placeholder
// app/components/movement-board/figma-calendar/CalendarLegend.tsx
import React from 'react'
import { StatusIcon, getStatusColor } from './StatusIcon'
import { ProductStatus } from './types'

const ITEMS: { key: ProductStatus; label: string }[] = [
  { key: 'CANDIDATE', label: 'Кандидат' },
  { key: 'IN_REQUEST', label: 'В заявке' },
  { key: 'IN_STORE', label: 'В магазине' },
  { key: 'SOLD', label: 'Продано' },
  { key: 'CLEAR', label: 'Пусто' },
]

export default function CalendarLegend() {
  return (
    <div className="flex gap-3 items-center p-2 bg-white rounded shadow-sm">
      {ITEMS.map(it => (
        <div key={it.key} className="flex items-center gap-2 text-sm">
          <div className="w-6 h-6 flex items-center justify-center">
            <StatusIcon status={it.key} size={16} />
          </div>
          <div style={{ color: getStatusColor(it.key) }} className="text-xs">{it.label}</div>
        </div>
      ))}
    </div>
  )
}
