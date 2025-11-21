// icons content placeholder
// app/components/movement-board/figma-calendar/StatusIcon.tsx
import React from 'react'
import { ProductStatus } from './types'

export function getStatusColor(status: ProductStatus) {
  switch(status) {
    case 'CANDIDATE': return '#7C3AED' // purple
    case 'IN_REQUEST': return '#EAB308' // amber
    case 'IN_STORE': return '#16A34A' // green
    case 'SOLD': return '#EF4444' // red
    default: return '#9CA3AF' // gray
  }
}

export function StatusIcon({ status, size=16 }: { status: ProductStatus, size?: number }) {
  const color = getStatusColor(status)
  const s = size
  switch(status) {
    case 'CANDIDATE':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="7" fill={color} />
          <path d="M5 8.2l1.6 1.6L11 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'IN_REQUEST':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" fill={color} />
        </svg>
      )
    case 'IN_STORE':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" stroke={color} strokeWidth="2" fill="none" />
        </svg>
      )
    case 'SOLD':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <path d="M3 8l3 3 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" fill="none" />
        </svg>
      )
  }
}
