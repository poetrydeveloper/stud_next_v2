// app/components/movement-board/figma-calendar/Calendar.tsx
'use client'

import React, { useMemo, useState } from 'react'
import CalendarDay from './CalendarDay'
import CalendarLegend from './CalendarLegend'
import ConnectionLines from './ConnectionLines'
import { buildCalendarData } from './adapter'
import type { ProductUnit, CalendarData } from './types'

interface Props {
  productUnits: ProductUnit[]
  monthAnchor?: Date
  onUnitClick?: (unitId: string | number) => void
  onDayClick?: (date: Date) => void
  className?: string
}

export default function FigmaCalendar({ productUnits = [], monthAnchor, onUnitClick, onDayClick, className }: Props) {
  console.log('🎯 FIGMA-CALENDAR: Начало рендера')
  console.log('📊 FIGMA-CALENDAR: Получены productUnits:', productUnits?.length)
  
  // ДЕТАЛЬНАЯ ОТЛАДКА ДАННЫХ
  if (productUnits && productUnits.length > 0) {
    console.log('🔍 FIGMA-CALENDAR: Первые 3 units:', productUnits.slice(0, 3).map(u => ({
      id: u.id,
      statusCard: u.statusCard,
      statusProduct: u.statusProduct,
      createdAt: u.createdAt,
      logsCount: u.logs?.length || 0,
      hasLogs: !!u.logs
    })))
  }

  const calendarData: CalendarData = useMemo(() => {
    console.log('🔄 FIGMA-CALENDAR: Начинаем построение календаря...')
    
    if (!productUnits || productUnits.length === 0) {
      console.log('⚠️ FIGMA-CALENDAR: Нет данных для построения')
      return { days: [], connections: [], monthInfo: { year: 0, month: 0, monthName: '', totalDays: 0 } }
    }

    try {
      const result = buildCalendarData(productUnits, monthAnchor)
      console.log('✅ FIGMA-CALENDAR: Успешно построено:', {
        daysCount: result.days.length,
        connectionsCount: result.connections.length,
        monthInfo: result.monthInfo
      })
      return result
    } catch (error) {
      console.error('💥 FIGMA-CALENDAR: Ошибка построения:', error)
      return { days: [], connections: [], monthInfo: { year: 0, month: 0, monthName: '', totalDays: 0 } }
    }
  }, [productUnits, monthAnchor])

  const { days, connections, monthInfo } = calendarData
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleDayClick = (d: Date) => {
    setSelectedDate(prev => (prev && prev.getTime() === d.getTime() ? null : d))
    onDayClick?.(d)
  }

  // ФУНКЦИИ ДЛЯ НАВИГАЦИИ ПО МЕСЯЦАМ
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonthAnchor = new Date(monthInfo.year, monthInfo.month + (direction === 'next' ? 1 : -1), 1)
    // Здесь можно добавить логику для смены месяца
    console.log('📅 Навигация:', direction, newMonthAnchor)
  }

  // ЕСЛИ ДАННЫХ НЕТ - ПОКАЗЫВАЕМ СООБЩЕНИЕ
  if (!productUnits || productUnits.length === 0) {
    return (
      <div className={`border rounded-lg p-6 bg-white text-center ${className}`}>
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

  // ЕСЛИ ДНИ НЕ ПОСТРОИЛИСЬ - ПОКАЗЫВАЕМ ИНФОРМАЦИЮ О ДАННЫХ
  if (days.length === 0) {
    return (
      <div className={`border rounded-lg p-4 bg-white ${className}`}>
        <CalendarLegend />
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <div className="text-yellow-800 text-sm font-medium mb-2">
            📊 Данные есть, но календарь не построился
          </div>
          
          <div className="text-xs text-yellow-700 space-y-1">
            <div>• Всего units: <strong>{productUnits.length}</strong></div>
            <div>• Units со статусами:</div>
            <div className="ml-4">
              {Array.from(new Set(productUnits.map(u => u.statusCard || u.statusProduct))).map(status => (
                <div key={status}>- {status}: {productUnits.filter(u => u.statusCard === status || u.statusProduct === status).length}</div>
              ))}
            </div>
            <div>• Units с логами: <strong>{productUnits.filter(u => u.logs && u.logs.length > 0).length}</strong></div>
          </div>
          
          <div className="mt-3 text-xs text-yellow-600">
            Проверьте консоль для детальной отладки
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* ЗАГОЛОВОК И ЛЕГЕНДА */}
      <div className="mb-4">
        <CalendarLegend />
      </div>

      {/* СТАТУС-БАР */}
      <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
        <div className="flex justify-between text-blue-800">
          <span>Дней: <strong>{days.filter(d => d.events.length > 0).length}</strong></span>
          <span>Связей: <strong>{connections.length}</strong></span>
          <span>Units: <strong>{productUnits.length}</strong></span>
        </div>
      </div>

      {/* КАЛЕНДАРЬ */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        
        {/* ЗАГОЛОВОК МЕСЯЦА */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
            title="Предыдущий месяц"
          >
            ←
          </button>
          
          <div className="text-center">
            <div className="font-semibold text-gray-800 text-lg capitalize">
              {monthInfo.monthName} {monthInfo.year}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {days.filter(d => d.events.length > 0).length} дней с событиями
            </div>
          </div>
          
          <button 
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
            title="Следующий месяц"
          >
            →
          </button>
        </div>

        {/* ДНИ НЕДЕЛИ */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        {/* СЕТКА ДНЕЙ */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => (
            <div key={idx} className={`min-h-[80px] ${!day.isCurrentMonth ? 'opacity-40' : ''}`}>
              <CalendarDay 
                day={day} 
                isSelected={selectedDate ? selectedDate.getTime() === day.date.getTime() : false} 
                onClick={handleDayClick} 
                compact={true}
              />
            </div>
          ))}
        </div>

        {/* ПОДСКАЗКА ЕСЛИ МАЛО ДАННЫХ */}
        {days.filter(d => d.events.length > 0).length <= 3 && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-center">
            <div className="text-xs text-gray-600">
              📅 Добавьте больше товарных единиц с разными датами для лучшего отображения
            </div>
          </div>
        )}
      </div>

      {/* ИНФОРМАЦИЯ О ВЫБРАННОМ ДНЕ */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-sm font-medium text-blue-800 mb-2">
            📅 Выбран день: {selectedDate.toLocaleDateString('ru-RU')}
          </div>
          <div className="text-xs text-blue-700">
            События: {days.find(d => d.date.getTime() === selectedDate.getTime())?.events.length || 0}
          </div>
        </div>
      )}
    </div>
  )
}