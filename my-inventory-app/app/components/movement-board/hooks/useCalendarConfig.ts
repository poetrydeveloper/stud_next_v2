// components/movement-board/hooks/useCalendarConfig.ts
'use client'

import { useState, useCallback } from 'react'

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

export type ConfigPreset = 'classic' | 'vertical' | 'compact'

// Конфигурации переносим прямо в хук для простоты
const classicCalendar: CalendarConfig = {
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

const verticalTimeline: CalendarConfig = {
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

const compactGrid: CalendarConfig = {
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

const configMap: Record<ConfigPreset, CalendarConfig> = {
  classic: classicCalendar,
  vertical: verticalTimeline,
  compact: compactGrid
}

export const useCalendarConfig = (initialPreset: ConfigPreset = 'compact') => {
  const [currentPreset, setCurrentPreset] = useState<ConfigPreset>(initialPreset)
  const [config, setConfig] = useState<CalendarConfig>(configMap[initialPreset])

  const switchConfig = useCallback((preset: ConfigPreset) => {
    setCurrentPreset(preset)
    setConfig(configMap[preset])
  }, [])

  const updateConfig = useCallback((updates: Partial<CalendarConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(configMap[currentPreset])
  }, [currentPreset])

  return {
    config,
    currentPreset,
    switchConfig,
    updateConfig,
    resetConfig,
    availablePresets: Object.keys(configMap) as ConfigPreset[]
  }
}