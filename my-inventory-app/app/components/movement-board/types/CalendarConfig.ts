// components/movement-board/types/CalendarConfig.ts
export interface CalendarConfig {
  layout: LayoutConfig
  days: DaysConfig
  timeline: TimelineConfig
  legend: LegendConfig
  interactions: InteractionsConfig
}

export interface LayoutConfig {
  type: 'monthly-grid' | 'vertical-timeline' | 'horizontal-scroll'
  visibleMonths: number
  gridColumns: number
  gridRows: number
  spacing: {
    betweenDays: number
    betweenMonths: number
  }
  orientation: 'horizontal' | 'vertical'
}

export interface DaysConfig {
  size: {
    width: number
    height: number
  }
  maxIconsPerDay: number
  overflowBehavior: 'stack' | 'collapse' | 'number' | 'scroll'
  styling: {
    currentDayColor: string
    selectedDayBorder: string
    defaultBackground: string
    textSize: string
  }
  compact: boolean
}

export interface TimelineConfig {
  enabled: boolean
  lineStyle: 'straight' | 'orthogonal' | 'curved'
  lineWidth: number
  colors: {
    [status: string]: string
  }
  routing: {
    avoidDays: boolean
    minClearance: number
  }
}

export interface LegendConfig {
  position: 'top' | 'bottom' | 'left' | 'right' | 'hidden'
  iconMapping: {
    [status: string]: {
      symbol: string
      color: string
      size: number
    }
  }
  tooltips: {
    enabled: boolean
    content: 'basic' | 'detailed' | 'custom'
  }
  compact: boolean
}

export interface InteractionsConfig {
  daySelection: {
    enabled: boolean
    multiple: boolean
    highlightColor: string
  }
  iconClick: {
    action: 'modal' | 'expand' | 'filter' | 'none'
    modalContent: 'units-list' | 'status-details' | 'custom'
  }
  hoverEffects: {
    enabled: boolean
    highlightLine: boolean
    showTooltip: boolean
  }
  scroll: {
    direction: 'horizontal' | 'vertical'
    snap: boolean
  }
}