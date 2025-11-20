// components/movement-board/CalendarTimeline.tsx - КОМПАКТНЫЙ
'use client'

import { useState } from 'react'
import CalendarNavigation from './CalendarNavigation'
import CalendarMonthView from './CalendarMonthView'

interface CalendarTimelineProps {
  product: any
  selectedMonth: Date
  onMonthChange: (date: Date) => void
}

export default function CalendarTimeline({ 
  product, 
  selectedMonth, 
  onMonthChange 
}: CalendarTimelineProps) {
  const [loading, setLoading] = useState(false)
  
  const handleMonthChange = async (newDate: Date) => {
    setLoading(true)
    onMonthChange(newDate)
    setTimeout(() => setLoading(false), 300)
  }

  return (
    <div className="bg-white border border-gray-200 rounded p-2">
      <h3 className="font-semibold text-gray-800 text-xs mb-2">Календарь движений</h3>
      
      <CalendarNavigation 
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        loading={loading}
      />
      
      <CalendarMonthView 
        selectedMonth={selectedMonth}
        productCode={product.code}
        loading={loading}
      />
    </div>
  )
}