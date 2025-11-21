// day content placeholder
// app/components/movement-board/figma-calendar/CalendarDay.tsx
import React from 'react'
import { DayData } from './types'
import { StatusIcon } from './StatusIcon'

interface Props {
  day: DayData
  isSelected: boolean
  onClick?: (d: Date) => void
}

export default function CalendarDay({ day, isSelected, onClick }: Props) {
  const dateLabel = day.date.getDate()
  return (
    <div
      onClick={() => onClick?.(day.date)}
      className={`p-2 rounded-lg border ${isSelected ? 'ring-2 ring-indigo-400' : 'border-transparent'}`}
      style={{ minWidth: 84, minHeight: 84, background: '#fff' }}
      role="button"
    >
      <div className="flex justify-between items-start">
        <div className="text-sm font-medium">{dateLabel}</div>
        {day.isToday && <div className="text-xs px-1 rounded bg-yellow-100 text-yellow-800">Сегодня</div>}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {day.events.map(ev => (
          <div key={ev.status} className="flex items-center gap-2 bg-gray-50 p-1 rounded">
            <StatusIcon status={ev.status} size={14} />
            <div className="text-xs">{ev.count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
