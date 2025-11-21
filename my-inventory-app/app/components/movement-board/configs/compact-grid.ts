// components/movement-board/configs/compact-grid.ts
import { CalendarConfig } from '../types/CalendarConfig'

export const compactGrid: CalendarConfig = {
  layout: {
    type: 'monthly-grid',
    visibleMonths: 2,
    gridColumns: 7,
    gridRows: 6,
    spacing: { betweenDays: 1, betweenMonths: 8 },
    orientation: 'vertical'
  },
  days: {
    size: { width: 28, height: 28 },
    maxIconsPerDay: 1,
    overflowBehavior: 'number',
    styling: {
      currentDayColor: '#3b82f6',
      selectedDayBorder: '1px solid #ef4444',
      defaultBackground: '#f8fafc',
      textSize: 'text-[10px]'
    },
    compact: true
  },
  timeline: {
    enabled: false,
    lineStyle: 'straight',
    lineWidth: 1,
    colors: {
      CLEAR: '#9ca3af',
      CANDIDATE: '#8b5cf6',
      IN_REQUEST: '#eab308',
      IN_STORE: '#10b981',
      SOLD: '#fbbf24'
    },
    routing: {
      avoidDays: true,
      minClearance: 4
    }
  },
  legend: {
    position: 'hidden',
    iconMapping: {
      CLEAR: { symbol: '○', color: '#9ca3af', size: 8 },
      CANDIDATE: { symbol: '◐', color: '#8b5cf6', size: 8 },
      IN_REQUEST: { symbol: '●', color: '#eab308', size: 8 },
      IN_STORE: { symbol: '□', color: '#10b981', size: 8 },
      SOLD: { symbol: '◧', color: '#fbbf24', size: 8 }
    },
    tooltips: {
      enabled: true,
      content: 'basic'
    },
    compact: true
  },
  interactions: {
    daySelection: {
      enabled: false,
      multiple: false,
      highlightColor: '#dbeafe'
    },
    iconClick: {
      action: 'none',
      modalContent: 'units-list'
    },
    hoverEffects: {
      enabled: false,
      highlightLine: false,
      showTooltip: false
    },
    scroll: {
      direction: 'vertical',
      snap: true
    }
  }
}