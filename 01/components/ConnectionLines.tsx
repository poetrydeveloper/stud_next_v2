//components/ConnectionLines
import { Connection, DayData } from "../types/calendar";
import { getDayPosition } from "../utils/calendarData";
import { getStatusColor } from "./StatusIcon";

interface ConnectionLinesProps {
  connections: Connection[];
  calendarDays: DayData[];
  highlightedProductIds: Set<string>;
}

export function ConnectionLines({
  connections,
  calendarDays,
  highlightedProductIds,
}: ConnectionLinesProps) {
  const cellSize = 80; // 80px cell size (increased from 32px)
  const gap = 4; // 4px gap between cells
  const totalCellSize = cellSize + gap;
  const offset = cellSize / 2; // Center of cell
  
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      {connections.map((connection, idx) => {
        const fromPos = getDayPosition(connection.fromDate, calendarDays);
        const toPos = getDayPosition(connection.toDate, calendarDays);
        
        if (!fromPos || !toPos) return null;
        
        // Calculate pixel positions (center of cells)
        const x1 = fromPos.col * totalCellSize + offset;
        const y1 = fromPos.row * totalCellSize + offset;
        const x2 = toPos.col * totalCellSize + offset;
        const y2 = toPos.row * totalCellSize + offset;
        
        const isHighlighted = highlightedProductIds.has(connection.productId);
        const color = getStatusColor(connection.toStatus);
        
        // Determine line style based on status transition
        const isDashed = connection.fromStatus === "CLEAR" || connection.fromStatus === "CANDIDATE";
        
        // Create orthogonal path (90 degree angles only)
        // Use L-shaped path: horizontal then vertical
        const midX = x1 + (x2 - x1) / 2;
        
        return (
          <g key={`${connection.productId}-${idx}`}>
            {/* Orthogonal connection lines (L-shaped) */}
            <path
              d={`M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`}
              stroke={color}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeDasharray={isDashed ? "3,3" : "none"}
              opacity={isHighlighted ? 0.9 : 0.3}
              fill="none"
              className="transition-all duration-200"
            />
            
            {/* Arrow head at the end */}
            {isHighlighted && (
              <polygon
                points={x2 > midX ? `${x2},${y2} ${x2-5},${y2-3} ${x2-5},${y2+3}` : `${x2},${y2} ${x2+5},${y2-3} ${x2+5},${y2+3}`}
                fill={color}
                opacity={0.9}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}