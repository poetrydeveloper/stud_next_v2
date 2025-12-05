// lines content placeholder
// app/components/movement-board/figma-calendar/ConnectionLines.tsx
import React from 'react'
import { Connection, DayData } from './types'
import { getStatusColor } from './StatusIcon'

/**
 * Упрощённый компонент: рисует SVG-линию между центрами ячеек.
 * Требует внешне передать вычисленные позиции day->x,y. Для простоты мы вычисляем
 * позиции предполагая фиксированный размер клетки; если у вас responsive layout —
 * можно затем заменить на настоящий DOM-lookup по ref.
 */

interface Props {
  connections: Connection[]
  days: DayData[]
  cellSize?: number // px
  onClickConnection?: (c: Connection) => void
}

// helper: map date to index (days[] sorted by date)
const isoKey = (d: Date) => d.toISOString().slice(0,10)

export default function ConnectionLines({ connections, days, cellSize = 92, onClickConnection }: Props) {
  // create map date->index
  const map = new Map<string, number>()
  days.forEach((d,i) => map.set(isoKey(d.date), i))

  const width = Math.max(600, (days.length+2) * cellSize)
  const height = 200

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      {connections.map((c, idx) => {
        const fromIdx = map.get(isoKey(c.fromDate))
        const toIdx = map.get(isoKey(c.toDate))
        if (fromIdx == null || toIdx == null) return null
        const y = 60
        const x1 = 40 + fromIdx * cellSize
        const x2 = 40 + toIdx * cellSize
        const color = getStatusColor(c.fromStatus)
        return (
          <g key={idx} onClick={() => onClickConnection?.(c)} style={{ cursor: 'pointer' }}>
            <path d={`M ${x1} ${y} C ${x1+30} ${y-20}, ${x2-30} ${y-20}, ${x2} ${y}`} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
            <circle cx={x2} cy={y} r={4} fill={getStatusColor(c.toStatus)} stroke="#fff" strokeWidth={1}/>
          </g>
        )
      })}
    </svg>
  )
}
