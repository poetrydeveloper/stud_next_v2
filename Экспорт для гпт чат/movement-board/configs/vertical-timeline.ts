// components/movement-board/configs/vertical-timeline.ts
import { CalendarConfig } from '../types/CalendarConfig'

export const verticalTimeline: CalendarConfig = {
  layout: {
    type: 'vertical-timeline',
    visibleMonths: 3,
    gridColumns: 1,
    gridRows: 31,
    spacing: { betweenDays: 2, betweenMonths: 12 },
    orientation: 'vertical'
  },
  days: {
    size: { width: 120, height: 32 },
    maxIconsPerDay: 4,
    overflowBehavior: 'scroll',
    styling: {
      currentDayColor: '#3b82f6',
      selectedDayBorder: '2px solid #ef4444',
      defaultBackground: '#f8fafc',
      textSize: 'text-xs'
    },
    compact: false
  },
  timeline: {
    enabled: true,
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
      avoidDays: false,
      minClearance: 4
    }
  },
  legend: {
    position: 'right',
    iconMapping: {
      CLEAR: { symbol: '○', color: '#9ca3af', size: 10 },
      CANDIDATE: { symbol: '◐', color: '#8b5cf6', size: 10 },
      IN_REQUEST: { symbol: '●', color: '#eab308', size: 10 },
      IN_STORE: { symbol: '□', color: '#10b981', size: 10 },
      SOLD: { symbol: '◧', color: '#fbbf24', size: 10 }
    },
    tooltips: {
      enabled: true,
      content: 'detailed'
    },
    compact: true
  },
  interactions: {
    daySelection: {
      enabled: true,
      multiple: true,
      highlightColor: '#dbeafe'
    },
    iconClick: {
      action: 'expand',
      modalContent: 'status-details'
    },
    hoverEffects: {
      enabled: true,
      highlightLine: true,
      showTooltip: true
    },
    scroll: {
      direction: 'vertical',
      snap: false
    }
  }
}