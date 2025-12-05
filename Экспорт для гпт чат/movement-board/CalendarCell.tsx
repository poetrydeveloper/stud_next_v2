// CalendarCell.tsx
'use client'
import React from 'react'
import type { CalendarConfig } from './types/CalendarConfig.js'
import { formatISODate, isSameDay } from './utils/date-utils'

interface Unit {
  id: number
  serialNumber?: string
  status?: string
  date?: string
}

interface Props {
  date: Date
  units: Unit[]
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  config: CalendarConfig
  onDayClick: (date: Date) => void
  onIconClick: (unit: Unit) => void
}

export default function CalendarCell({
  date,
  units,
  isCurrentMonth,
  isToday,
  isSelected,
  config,
  onDayClick,
  onIconClick,
}: Props) {
  const ds = config.days
  const bg = isCurrentMonth ? ds.styling.defaultBackground : '#ffffff'
  const border = isSelected ? ds.styling.selectedDayBorder : '1px solid transparent'
  const todayDot = isToday ? (
    <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full" style={{ background: ds.styling.currentDayColor }} />
  ) : null

  const icons = units.slice(0, ds.maxIconsPerDay)

  return (
    <div
      onClick={() => onDayClick(date)}
      className={`relative flex flex-col items-start p-2 cursor-pointer select-none`}
      style={{
        width: ds.size.width,
        height: ds.size.height,
        background: bg,
        border,
        borderRadius: 8,
      }}
    >
      <div className={`text-xs ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'} `}>{date.getDate()}</div>

      <div className="flex gap-1 mt-1 items-center">
        {icons.map((u) => {
          const icon = config.legend.iconMapping[u.status || 'CLEAR'] || { symbol: '◯', color: '#9ca3af', size: 12 }
          return (
            <button
              key={u.id}
              onClick={(e) => {
                e.stopPropagation()
                onIconClick(u)
              }}
              title={`${u.status ?? 'UNKNOWN'} ${u.serialNumber ? `· ${u.serialNumber}` : ''}`}
              className="flex items-center justify-center rounded-full"
              style={{
                width: icon.size + 6,
                height: icon.size + 6,
                fontSize: icon.size,
                color: icon.color,
                background: 'transparent',
                padding: 0,
              }}
            >
              {icon.symbol}
            </button>
          )
        })}

        {units.length > ds.maxIconsPerDay && ds.overflowBehavior === 'number' ? (
          <div className="text-xs text-gray-500">+{units.length - ds.maxIconsPerDay}</div>
        ) : null}
      </div>

      {todayDot}
    </div>
  )
}
