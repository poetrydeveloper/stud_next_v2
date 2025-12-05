// app/components/movement-board/figma-calendar/Calendar.tsx
'use client'

import React, { useMemo, useState } from 'react'
import CalendarDay from './CalendarDay'
import CalendarLegend from './CalendarLegend'
import ConnectionLines from './ConnectionLines'
import ProductDetails from './ProductDetails'
import { buildCalendarData } from './adapter'
import { useTooltip } from './useTooltip'
import type { ProductUnit, CalendarData } from './types'

interface Props {
  productUnits: ProductUnit[]
  monthAnchor?: Date
  onUnitClick?: (unitId: string | number) => void
  onDayClick?: (date: Date) => void
  className?: string
}

export default function FigmaCalendar({ productUnits = [], monthAnchor, onUnitClick, onDayClick, className }: Props) {
  const [currentDate, setCurrentDate] = useState(monthAnchor || new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [hoveredProductIds, setHoveredProductIds] = useState<Set<string>>(new Set())
  const { tooltip, showTooltip, hideTooltip } = useTooltip()

  const calendarData: CalendarData = useMemo(() => {
    if (!productUnits || productUnits.length === 0) {
      return { days: [], connections: [], monthInfo: { year: 0, month: 0, monthName: '', totalDays: 0 } }
    }
    return buildCalendarData(productUnits, currentDate)
  }, [productUnits, currentDate])

  const { days, connections, monthInfo } = calendarData

  const handleDayClick = (date: Date) => {
    const newSelectedDate = selectedDate?.getTime() === date.getTime() ? null : date
    setSelectedDate(newSelectedDate)
    onDayClick?.(date)
  }

  const handleDayHover = (day: any) => {
    if (day.events.length === 0) return
    
    const productIds = new Set<string>()
    day.events.forEach((event: any) => {
      event.productIds.forEach((id: any) => productIds.add(id.toString()))
    })
    
    setHoveredProductIds(productIds)
  }

  const handleDayLeave = () => {
    setHoveredProductIds(new Set())
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
    setSelectedDate(null)
  }

  // ЕСЛИ ДАННЫХ НЕТ
  if (!productUnits || productUnits.length === 0) {
    return (
      <div className={`bg-white rounded-xl border p-6 text-center ${className}`}>
        <div className="text-gray-500 mb-2">
          <div className="text-2xl">📅</div>
          <div className="text-sm font-medium">Нет данных для календаря</div>
        </div>
        <div className="text-xs text-gray-400">
          Не найдено товарных единиц для отображения
        </div>
      </div>
    )
  }

  return (
    <div className={`container max-w-7xl mx-auto ${className}`}>
      {/* Header */}
      <div className="header mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Unit Tracker</h1>
        <p className="text-gray-600">Track product status changes with visual connections</p>
      </div>

      {/* Legend */}
      <div className="card bg-white rounded-xl border mb-6">
        <div className="card-header p-5 border-b">
          <div className="card-title text-lg font-semibold text-gray-900">Status Legend</div>
        </div>
        <div className="card-content p-5">
          <CalendarLegend />
        </div>
      </div>

      {/* Main Grid */}
      <div className="main-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - 2/3 ширины */}
        <div className="lg:col-span-2">
          <div className="card bg-white rounded-xl border">
            <div className="card-header p-5 border-b">
              <div className="calendar-header flex justify-between items-center">
                <div className="card-title text-lg font-semibold text-gray-900">
                  {monthInfo.monthName} {monthInfo.year}
                </div>
                <div className="nav-buttons flex gap-2">
                  <button 
                    onClick={() => navigateMonth('prev')}
                    className="btn px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    ←
                  </button>
                  <button 
                    onClick={() => navigateMonth('next')}
                    className="btn px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <div className="card-content p-5">
              {/* Weekday Headers */}
              <div className="weekday-header grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="weekday w-20 h-8 flex items-center justify-center text-xs text-gray-500 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="calendar-grid-container relative">
                <ConnectionLines
                  connections={connections}
                  calendarDays={days}
                  highlightedProductIds={hoveredProductIds}
                />
                
                <div className="calendar-grid grid grid-cols-7 gap-1 relative z-10">
                  {days.map((day, index) => {
                    const isSelected = selectedDate?.toDateString() === day.date.toDateString()
                    const isHighlighted = day.events.some((event: any) =>
                      event.productIds.some((id: any) => hoveredProductIds.has(id.toString()))
                    )

                    return (
                      <CalendarDay
                        key={index}
                        day={day}
                        isSelected={isSelected}
                        isHighlighted={isHighlighted}
                        onClick={handleDayClick}
                        onMouseEnter={() => handleDayHover(day)}
                        onMouseLeave={handleDayLeave}
                        onStatusHover={showTooltip}
                        onStatusLeave={hideTooltip}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="info-text mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Hover over days with events to highlight product chains. Click to view details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details - 1/3 ширины */}
        <div className="lg:col-span-1">
          <div className="card bg-white rounded-xl border">
            <div className="card-header p-5 border-b">
              <div className="card-title text-lg font-semibold text-gray-900">
                {selectedDate 
                  ? selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long", 
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Product Details"
                }
              </div>
            </div>
            <div className="card-content p-5">
              <ProductDetails 
                products={productUnits}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div 
          className="tooltip fixed bg-gray-900 text-white px-3 py-2 rounded-lg text-xs pointer-events-none z-50"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}