// components/movement-board/configs/classic-calendar.ts
import { CalendarConfig } from '../types/CalendarConfig'

export const classicCalendar: CalendarConfig = {
  layout: {
    type: 'monthly-grid',
    visibleMonths: 1,
    gridColumns: 7,
    gridRows: 6,
    spacing: { betweenDays: 4, betweenMonths: 16 },
    orientation: 'horizontal'
  },
  days: {
    size: { width: 36, height: 36 },
    maxIconsPerDay: 2,
    overflowBehavior: 'number',
    styling: {
      currentDayColor: '#3b82f6',
      selectedDayBorder: '2px solid #ef4444',
      defaultBackground: '#f8fafc',
      textSize: 'text-xs'
    },
    compact: true
  },
  timeline: {
    enabled: false,
    lineStyle: 'straight',
    lineWidth: 2,
    colors: {
      CLEAR: '#9ca3af',
      CANDIDATE: '#8b5cf6', 
      IN_REQUEST: '#eab308',
      IN_STORE: '#10b981',
      SOLD: '#fbbf24'
    },
    routing: {
      avoidDays: true,
      minClearance: 8
    }
  },
  legend: {
    position: 'bottom',
    iconMapping: {
      CLEAR: { symbol: '○', color: '#9ca3af', size: 12 },
      CANDIDATE: { symbol: '◐', color: '#8b5cf6', size: 12 },
      IN_REQUEST: { symbol: '●', color: '#eab308', size: 12 },
      IN_STORE: { symbol: '□', color: '#10b981', size: 12 },
      SOLD: { symbol: '◧', color: '#fbbf24', size: 12 }
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
      action: 'modal',
      modalContent: 'units-list'
    },
    hoverEffects: {
      enabled: true,
      highlightLine: false,
      showTooltip: true
    },
    scroll: {
      direction: 'vertical',
      snap: true
    }
  }
}