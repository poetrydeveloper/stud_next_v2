// components/movement-board/CalendarTimeline.tsx
'use client'

import { useState } from 'react'
import CalendarNavigation from './CalendarNavigation'
import CalendarMonthView from './CalendarMonthView'

interface CalendarTimelineProps {
  product: any
  selectedMonth: Date
  onMonthChange: (date: Date) => void
  productUnits: any[]
}

export default function CalendarTimeline({ 
  product, 
  selectedMonth, 
  onMonthChange,
  productUnits
}: CalendarTimelineProps) {
  const [loading, setLoading] = useState(false)
  
  const handleMonthChange = async (newDate: Date) => {
    setLoading(true)
    onMonthChange(newDate)
    setTimeout(() => setLoading(false), 200)
  }

  return (
    <div className="bg-white border border-gray-200 rounded p-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800 text-xs">Календарь движений</h3>
      </div>
      
      <CalendarNavigation 
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        loading={loading}
      />
      
      <CalendarMonthView 
        selectedMonth={selectedMonth}
        productCode={product.code}
        loading={loading}
        productUnits={productUnits}
      />

      {/* Компактная легенда */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex flex-wrap justify-center gap-1 text-[10px]">
          {['CLEAR', 'CANDIDATE', 'IN_REQUEST', 'IN_STORE', 'SOLD'].map((status) => (
            <div key={status} className="flex items-center gap-0.5 px-1.5 py-0.5">
              <span className={getStatusColor(status)}>{getStatusIcon(status)}</span>
              <span className="text-gray-600">{getStatusLabel(status)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    CLEAR: '○', CANDIDATE: '◐', IN_REQUEST: '●', 
    IN_STORE: '□', SOLD: '◧'
  }
  return icons[status] || '○'
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    CLEAR: 'text-gray-400', CANDIDATE: 'text-purple-500', 
    IN_REQUEST: 'text-yellow-500', IN_STORE: 'text-green-500', 
    SOLD: 'text-yellow-300'
  }
  return colors[status] || 'text-gray-400'
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    CLEAR: 'Создан', CANDIDATE: 'Кандидат', 
    IN_REQUEST: 'В заявке', IN_STORE: 'В магазине', 
    SOLD: 'Продан'
  }
  return labels[status] || status
}