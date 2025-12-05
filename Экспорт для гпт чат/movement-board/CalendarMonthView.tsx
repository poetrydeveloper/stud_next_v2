// components/movement-board/CalendarMonthView.tsx
'use client'

import { useEffect, useState } from 'react'

interface CalendarMonthViewProps {
  selectedMonth: Date
  productCode: string
  loading: boolean
  productUnits: any[]
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  units: {
    CLEAR: any[]
    CANDIDATE: any[]
    IN_REQUEST: any[]
    IN_STORE: any[]
    SOLD: any[]
  }
}

export default function CalendarMonthView({ 
  selectedMonth, 
  productCode, 
  loading,
  productUnits
}: CalendarMonthViewProps) {
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])

  useEffect(() => {
    generateCalendarData(selectedMonth, productUnits)
  }, [selectedMonth, productCode, productUnits])

  const generateCalendarData = (month: Date, units: any[]) => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    const firstDay = new Date(year, monthIndex, 1)
    
    const days: CalendarDay[] = []
    const startDay = new Date(firstDay)
    startDay.setDate(startDay.getDate() - firstDay.getDay())
    
    const totalDays = 42 // 6 weeks
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDay)
      currentDate.setDate(startDay.getDate() + i)
      
      const dayUnits = units.filter(unit => {
        const unitDate = new Date(unit.createdAt)
        return unitDate.toDateString() === currentDate.toDateString()
      })
      
      const unitsByStatus = {
        CLEAR: dayUnits.filter(unit => unit.statusCard === 'CLEAR'),
        CANDIDATE: dayUnits.filter(unit => unit.statusCard === 'CANDIDATE'),
        IN_REQUEST: dayUnits.filter(unit => unit.statusCard === 'IN_REQUEST'),
        IN_STORE: dayUnits.filter(unit => unit.statusProduct === 'IN_STORE'),
        SOLD: dayUnits.filter(unit => unit.statusProduct === 'SOLD')
      }
      
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === monthIndex,
        units: unitsByStatus
      })
    }
    
    setCalendarDays(days)
  }

  const getStatusIconsForDay = (units: CalendarDay['units']) => {
    return Object.entries(units)
      .filter(([_, unitArray]) => unitArray.length > 0)
      .map(([status, unitArray]) => ({
        status,
        count: unitArray.length,
        icon: getStatusIcon(status),
        color: getStatusColor(status)
      }))
      .slice(0, 2) // Максимум 2 иконки на день
  }

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-12">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Заголовки дней недели - компактные */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-[10px] text-gray-500 py-0.5">
            {day}
          </div>
        ))}
      </div>

      {/* Дни календаря - суперкомпактные */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day, index) => {
          const statusIcons = getStatusIconsForDay(day.units)
          const isToday = day.date.toDateString() === new Date().toDateString()
          const hasEvents = statusIcons.length > 0

          return (
            <div
              key={index}
              className={`
                min-h-6 p-0.5 border rounded-sm flex flex-col items-center justify-center
                text-[10px] leading-none
                ${
                  day.isCurrentMonth 
                    ? 'bg-white border-gray-200 text-gray-700' 
                    : 'bg-gray-50 border-gray-100 text-gray-400'
                }
                ${isToday ? 'border-blue-500 bg-blue-50 font-medium' : ''}
                ${hasEvents ? 'cursor-pointer hover:bg-gray-50' : ''}
              `}
            >
              {/* Число */}
              <div className="text-center mb-0.5">
                {day.date.getDate()}
              </div>

              {/* Иконки статусов - очень компактные */}
              {statusIcons.length > 0 && (
                <div className="flex justify-center items-center gap-0.5 w-full">
                  {statusIcons.map((item, idx) => (
                    <div
                      key={idx}
                      className={`text-[8px] ${item.color}`}
                      title={`${getStatusLabel(item.status)}: ${item.count}`}
                    >
                      {item.icon}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
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