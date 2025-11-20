// components/movement-board/CalendarMonthView.tsx - КОМПАКТНЫЙ
'use client'

import { useEffect, useState } from 'react'

interface CalendarMonthViewProps {
  selectedMonth: Date
  productCode: string
  loading: boolean
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  units: {
    CLEAR: number
    CANDIDATE: number
    IN_REQUEST: number
    IN_STORE: number
    SOLD: number
  }
}

export default function CalendarMonthView({ 
  selectedMonth, 
  productCode, 
  loading 
}: CalendarMonthViewProps) {
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])

  useEffect(() => {
    generateCalendarData(selectedMonth)
  }, [selectedMonth, productCode])

  const generateCalendarData = (month: Date) => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    
    const days: CalendarDay[] = []
    const startDay = new Date(firstDay)
    startDay.setDate(startDay.getDate() - firstDay.getDay())
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDay)
      currentDate.setDate(startDay.getDate() + i)
      
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === monthIndex,
        units: {
          CLEAR: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
          CANDIDATE: Math.random() > 0.8 ? Math.floor(Math.random() * 2) : 0,
          IN_REQUEST: Math.random() > 0.9 ? Math.floor(Math.random() * 2) : 0,
          IN_STORE: Math.random() > 0.6 ? Math.floor(Math.random() * 4) : 0,
          SOLD: Math.random() > 0.5 ? Math.floor(Math.random() * 5) : 0
        }
      })
    }
    
    setCalendarDays(days)
  }

  const getStatusIconsForDay = (units: CalendarDay['units']) => {
    const icons = []
    if (units.CLEAR > 0) icons.push({ count: units.CLEAR, icon: '○', color: 'text-gray-400' })
    if (units.CANDIDATE > 0) icons.push({ count: units.CANDIDATE, icon: '◐', color: 'text-purple-500' })
    if (units.IN_REQUEST > 0) icons.push({ count: units.IN_REQUEST, icon: '●', color: 'text-yellow-500' })
    if (units.IN_STORE > 0) icons.push({ count: units.IN_STORE, icon: '□', color: 'text-green-500' })
    if (units.SOLD > 0) icons.push({ count: units.SOLD, icon: '◧', color: 'text-yellow-300' })
    return icons.slice(0, 2) // Ограничиваем 2 иконками на ячейку
  }

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-20">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded">
      {/* Заголовки дней недели */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs text-gray-500 py-0.5">
            {day}
          </div>
        ))}
      </div>

      {/* Дни календаря - КОМПАКТНЫЕ */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-8 p-0.5 border rounded text-xs ${
              day.isCurrentMonth 
                ? 'bg-white border-gray-200' 
                : 'bg-gray-50 border-gray-100 text-gray-400'
            } ${day.date.toDateString() === new Date().toDateString() ? 'border-blue-300 bg-blue-50' : ''}`}
          >
            {/* Число */}
            <div className={`text-xs text-center ${day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>
              {day.date.getDate()}
            </div>

            {/* Иконки статусов - ТОЛЬКО ЦИФРЫ */}
            <div className="flex justify-center gap-0.5 mt-0.5">
              {getStatusIconsForDay(day.units).map((status, idx) => (
                <div key={idx} className={`text-xs font-medium ${status.color}`} title={`${status.icon}: ${status.count}`}>
                  {status.count}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}