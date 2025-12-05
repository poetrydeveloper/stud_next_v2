// app/components/movement-board/figma-calendar/useTooltip.ts
import { useState, useCallback } from 'react'

interface TooltipState {
  show: boolean
  text: string
  x: number
  y: number
}

export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false,
    text: '',
    x: 0,
    y: 0
  })

  const showTooltip = useCallback((event: React.MouseEvent, text: string) => {
    setTooltip({
      show: true,
      text,
      x: event.clientX + 10,
      y: event.clientY + 10
    })
  }, [])

  const hideTooltip = useCallback(() => {
    setTooltip(prev => ({ ...prev, show: false }))
  }, [])

  return {
    tooltip,
    showTooltip,
    hideTooltip
  }
}