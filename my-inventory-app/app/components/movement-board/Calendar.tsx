// Calendar.tsx
'use client'
import React, { useMemo, useState } from 'react'
import type { CalendarConfig } from './types/CalendarConfig.js'
import CalendarLegend from './CalendarLegend'
import CalendarCell from './CalendarCell'
import { startOfMonth, endOfMonth, addDays, formatISODate, isSameDay } from './utils/date-utils'

/**
 * Props:
 * - config: CalendarConfig (из useCalendarConfig или из ваших configs)
 * - productUnits: массив ProductUnits с полем date (ISO) и status
 *
 * Example unit: { id: 1, serialNumber: 'SN', status: 'CANDIDATE', date: '2025-11-20' }
 */

interface Unit {
  id: number
  serialNumber?: string
  status?: string
  date?: string
}

interface Props {
  config: CalendarConfig
  productUnits: Unit[]
  month?: Date // показываемый месяц (по умолчанию — этот)
}

export default function Calendar({ config, productUnits, month = new Date() }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [modalUnit, setModalUnit] = useState<Unit | null>(null)

  // рассчитываем сетку дат для месячного представления
  const daysGrid = useMemo(() => {
    if (config.layout.type !== 'monthly-grid') return []

    const first = startOfMonth(month)
    const last = endOfMonth(month)

    // вычисляем первый день недели (понедельник = 1)
    const startWeekDay = (first.getDay() + 6) % 7 // преобразуем: 0(Sun)->6, 1(Mon)->0...
    const totalCells = config.layout.gridColumns * config.layout.gridRows
    const startDate = addDays(first, -startWeekDay)

    const cells: Date[] = []
    for (let i = 0; i < totalCells; i++) {
      cells.push(addDays(startDate, i))
    }
    return cells
  }, [config.layout, month])

  // группируем units по дате
  const unitsByDate = useMemo(() => {
    const map = new Map<string, Unit[]>()
    for (const u of productUnits || []) {
      if (!u.date) continue
      const k = formatISODate(new Date(u.date))
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(u)
    }
    return map
  }, [productUnits])

  const handleDayClick = (d: Date) => {
    if (!config.interactions.daySelection.enabled) return
    setSelectedDate((prev) => (prev && isSameDay(prev, d) ? null : d))
  }

  const handleIconClick = (u: Unit) => {
    if (config.interactions.iconClick.action === 'modal') {
      setModalUnit(u)
    } else if (config.interactions.iconClick.action === 'expand') {
      // простая демонстрация — ставим modalUnit тоже
      setModalUnit(u)
    }
  }

  const today = new Date()

  return (
    <div className="w-full">
      {/* Legend */}
      {config.legend.position === 'top' && <CalendarLegend legend={config.legend} />}

      {/* Grid */}
      {config.layout.type === 'monthly-grid' && (
        <div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${config.layout.gridColumns}, minmax(0,1fr))`,
            }}
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="text-xs text-gray-500 text-center">
                {d}
              </div>
            ))}
            {daysGrid.map((d, idx) => {
              const iso = formatISODate(d)
              const units = unitsByDate.get(iso) || []
              const isCurrentMonth = d.getMonth() === month.getMonth()
              const isToday = isSameDay(d, today)
              const isSelected = selectedDate ? isSameDay(d, selectedDate) : false

              return (
                <div key={idx} className="flex justify-center">
                  <CalendarCell
                    date={d}
                    units={units}
                    isCurrentMonth={isCurrentMonth}
                    isToday={isToday}
                    isSelected={isSelected}
                    config={config}
                    onDayClick={handleDayClick}
                    onIconClick={handleIconClick}
                  />
                </div>
              )
            })}
          </div>

          {/* Selected day panel */}
          {selectedDate && (
            <div className="mt-4 p-3 bg-white border rounded shadow-sm">
              <div className="font-medium mb-2">День: {selectedDate.toDateString()}</div>
              <div className="flex flex-col gap-2">
                {(unitsByDate.get(formatISODate(selectedDate)) || []).map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="text-sm font-medium">{u.serialNumber ?? `Unit ${u.id}`}</div>
                      <div className="text-xs text-gray-500">{u.status}</div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleIconClick(u)}
                        className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200"
                      >
                        Детали
                      </button>
                    </div>
                  </div>
                ))}
                {(unitsByDate.get(formatISODate(selectedDate)) || []).length === 0 && (
                  <div className="text-sm text-gray-500">Нет юнитов в этот день</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend bottom */}
      {config.legend.position === 'bottom' && <div className="mt-3"><CalendarLegend legend={config.legend} /></div>}

      {/* Modal simple */}
      {modalUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setModalUnit(null)} />
          <div className="bg-white p-4 rounded shadow-lg w-96 z-10">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">Unit #{modalUnit.id}</div>
              <button onClick={() => setModalUnit(null)} className="text-gray-500">✕</button>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <div><strong>Serial:</strong> {modalUnit.serialNumber ?? '-'}</div>
              <div><strong>Status:</strong> {modalUnit.status ?? '-'}</div>
              <div><strong>Date:</strong> {modalUnit.date ?? '-'}</div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setModalUnit(null)} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
