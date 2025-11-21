'use client'

import { useMemo } from "react"
import { normalizeLogs } from "./calendar/normalizeLogs"
import { buildCalendar } from "./calendar/buildCalendar"
import CalendarLegend from "./calendar/CalendarLegend"
import CalendarDay from "./calendar/CalendarDay"

export default function CalendarTimeline({
  product,
  productUnits,
  selectedMonth,
  onMonthChange
}: any) {

  const { days, lines } = useMemo(() => {
    const events = normalizeLogs(productUnits)
    return buildCalendar(selectedMonth, events)
  }, [productUnits, selectedMonth])

  return (
    <div className="relative bg-white p-4 border rounded-lg">

      <CalendarLegend />

      <div className="overflow-x-auto relative">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {lines.map((line, i) => (
            <line
              key={i}
              x1={getXForDate(line.from)}
              y1={getYForDate(line.from)}
              x2={getXForDate(line.to)}
              y2={getYForDate(line.to)}
              stroke={line.color}
              strokeWidth="2"
            />
          ))}
        </svg>

        <div className="grid grid-cols-7 gap-2 relative z-10">
          {days.map((day: any, index: number) => (
            <CalendarDay key={index} day={day} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Вычисление позиции точки в SVG:
function getXForDate(date: Date) { return date.getDate() * 20 }
function getYForDate(date: Date) { return date.getDay() * 30 }
