// app/components/movement-board/figma-calendar/ConnectionLines.tsx
import React from 'react'
import { Connection, DayData } from './types'
import { getStatusColor } from './StatusIcon'

interface ConnectionLinesProps {
  connections: Connection[]
  calendarDays: DayData[]
  highlightedProductIds?: Set<string>
}

export default function ConnectionLines({
  connections,
  calendarDays,
  highlightedProductIds = new Set()
}: ConnectionLinesProps) {
  const cellSize = 80
  const gap = 4
  const totalCellSize = cellSize + gap
  const offset = cellSize / 2

  // Create date to position mapping
  const dateToPosition = new Map<string, { x: number; y: number }>()
  
  calendarDays.forEach((day, index) => {
    const row = Math.floor(index / 7)
    const col = index % 7
    
    const x = col * totalCellSize + offset
    const y = row * totalCellSize + offset
    
    dateToPosition.set(day.date.toDateString(), { x, y })
  })

  return (
    <svg
      className="connection-lines absolute inset-0 pointer-events-none"
      width={totalCellSize * 7}
      height={totalCellSize * 6}
    >
      {connections.map((connection, idx) => {
        const fromPos = dateToPosition.get(connection.fromDate.toDateString())
        const toPos = dateToPosition.get(connection.toDate.toDateString())
        
        if (!fromPos || !toPos) return null
        
        const isHighlighted = highlightedProductIds.has(connection.productId.toString())
        const color = getStatusColor(connection.toStatus)
        
        // L-shaped paths как в Figma
        const isDashed = connection.fromStatus === "CLEAR" || connection.fromStatus === "CANDIDATE"
        const midX = fromPos.x + (toPos.x - fromPos.x) / 2
        
        return (
          <g key={`${connection.productId}-${idx}`}>
            {/* L-shaped path */}
            <path
              d={`M ${fromPos.x} ${fromPos.y} L ${midX} ${fromPos.y} L ${midX} ${toPos.y} L ${toPos.x} ${toPos.y}`}
              stroke={color}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeDasharray={isDashed ? "3,3" : "none"}
              opacity={isHighlighted ? 0.9 : 0.3}
              fill="none"
              className="transition-all duration-200"
            />
            
            {/* Arrow head как в Figma */}
            {isHighlighted && (
              <polygon
                points={
                  toPos.x > midX 
                    ? `${toPos.x},${toPos.y} ${toPos.x-5},${toPos.y-3} ${toPos.x-5},${toPos.y+3}`
                    : `${toPos.x},${toPos.y} ${toPos.x+5},${toPos.y-3} ${toPos.x+5},${toPos.y+3}`
                }
                fill={color}
                opacity={0.9}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}