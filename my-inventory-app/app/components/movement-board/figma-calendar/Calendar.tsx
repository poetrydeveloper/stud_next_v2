// calendar content placeholder
// app/components/movement-board/figma-calendar/Calendar.tsx
import React, { useMemo, useState } from 'react'
import CalendarDay from './CalendarDay'
import CalendarLegend from './CalendarLegend'
import ConnectionLines from './ConnectionLines'
import { buildCalendarData } from './adapter'
import type { ProductUnit } from './types'

interface Props {
  productUnits: ProductUnit[]
  monthAnchor?: Date
  onUnitClick?: (unitId: string | number) => void
  onDayClick?: (date: Date) => void
  className?: string
}

export default function FigmaCalendar({ productUnits = [], monthAnchor, onUnitClick, onDayClick, className }: Props) {
  const { days, connections } = useMemo(() => buildCalendarData(productUnits, monthAnchor), [productUnits, monthAnchor])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleDayClick = (d: Date) => {
    setSelectedDate(prev => (prev && prev.getTime() === d.getTime() ? null : d))
    onDayClick?.(d)
  }

  return (
    <div className={className}>
      <div className="mb-3">
        <CalendarLegend />
      </div>

      <div className="relative bg-transparent rounded p-2">
        {/* connection lines (simple horizontal layout) */}
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: 120 }}>
          <ConnectionLines connections={connections} days={days} />
        </div>

        {/* days row */}
        <div className="mt-28 flex gap-3 overflow-x-auto p-2">
          {days.map((d, idx) => (
            <div key={idx} className="flex-shrink-0">
              <CalendarDay day={d} isSelected={selectedDate ? selectedDate.getTime()===d.date.getTime() : false} onClick={handleDayClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
