// app/components/movement-board/figma-calendar/CalendarDay.tsx
import React from 'react'
import { DayData } from './types'
import { StatusIcon, getStatusLabel } from './StatusIcon'

interface Props {
  day: DayData
  isSelected: boolean
  isHighlighted?: boolean
  onClick?: (d: Date) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function CalendarDay({ 
  day, 
  isSelected, 
  isHighlighted = false,
  onClick, 
  onMouseEnter,
  onMouseLeave 
}: Props) {
  const hasEvents = day.events.length > 0;
  
  // Get top 4 status events как в Figma
  const displayEvents = day.events.slice(0, 4);
  
  return (
    <div
      onClick={() => onClick?.(day.date)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        relative w-20 h-20 rounded
        flex flex-col items-center justify-between p-1
        cursor-pointer transition-all duration-200
        ${day.isToday 
          ? 'bg-blue-50 border-2 border-blue-500' 
          : day.isCurrentMonth 
            ? 'bg-white border border-gray-200' 
            : 'bg-gray-50 border border-gray-100'
        }
        ${isSelected ? 'ring-2 ring-blue-400' : ''}
        ${isHighlighted ? 'ring-2 ring-purple-400' : ''}
        ${hasEvents && !day.isToday ? 'hover:bg-gray-50' : ''}
      `}
      title={hasEvents ? 
        day.events.map(event => `${getStatusLabel(event.status)}: ${event.count}`).join(', ') 
        : ''
      }
    >
      {/* Date Number */}
      <div
        className={`
          text-xs w-full text-center
          ${day.isToday ? 'font-semibold text-blue-700' : ''}
          ${day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}
        `}
      >
        {day.date.getDate()}
      </div>
      
      {/* Status Dashboard как в Figma */}
      {hasEvents && (
        <div className="flex flex-col items-center gap-0.5 w-full">
          {displayEvents.map((event, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-1 px-1 py-0.5 bg-gray-800/5 rounded w-full justify-center"
              title={`${getStatusLabel(event.status)}: ${event.count}`}
            >
              <StatusIcon status={event.status} size={10} />
              <span className="text-[10px] text-gray-700">{event.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}