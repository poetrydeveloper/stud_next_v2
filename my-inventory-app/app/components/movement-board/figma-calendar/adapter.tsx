// adapter content placeholder
// app/components/movement-board/figma-calendar/adapter.tsx
import { ProductUnit, DayData, Connection, ProductStatus } from './types'

/**
 * Преобразует productUnits (из вашего проекта) в:
 *  - days: DayData[] для календаря
 *  - connections: Connection[] для линий движения
 *
 * Ожидаемый вход: productUnits: Array<{ id, serialNumber?, status?, date?: ISO }>
 */

function toStatus(s?: string): ProductStatus {
  if (!s) return 'CLEAR'
  const norm = String(s).toUpperCase()
  if (norm.includes('CANDID') || norm === 'CANDIDATE') return 'CANDIDATE'
  if (norm.includes('REQUEST') || norm === 'IN_REQUEST') return 'IN_REQUEST'
  if (norm.includes('STORE') || norm === 'IN_STORE') return 'IN_STORE'
  if (norm === 'SOLD' || norm.includes('SOLD')) return 'SOLD'
  return 'CLEAR'
}

export function buildCalendarData(productUnits: ProductUnit[], monthAnchor?: Date) {
  // monthAnchor — optional: начальная дата/месяц для визуализации; если не передан — текущий месяц
  const units = (productUnits || []).map(u => ({
    ...u,
    dateObj: u.date ? new Date(u.date) : null,
    statusNorm: toStatus(u.status)
  }))

  // collect days map keyed by ISO date (YYYY-MM-DD)
  const daysMap = new Map<string, DayData>()

  const padISO = (d: Date) => d.toISOString().slice(0,10)

  for (const u of units) {
    if (!u.dateObj) continue
    const key = padISO(u.dateObj)
    const st = u.statusNorm
    const exist = daysMap.get(key)
    if (!exist) {
      daysMap.set(key, {
        date: new Date(u.dateObj.getFullYear(), u.dateObj.getMonth(), u.dateObj.getDate()),
        events: [{ status: st, count: 1, productIds: [u.id] }],
        isCurrentMonth: true,
        isToday: isToday(u.dateObj)
      })
    } else {
      const ev = exist.events.find(e => e.status === st)
      if (ev) {
        ev.count += 1
        ev.productIds.push(u.id)
      } else {
        exist.events.push({ status: st, count: 1, productIds: [u.id] })
      }
    }
  }

  // Build connections: we try to detect same product id across days and create a connection from earlier -> later status
  const unitsById = new Map<string | number, { date: Date | null; status: ProductStatus }[]>()
  for (const u of units) {
    const arr = unitsById.get(u.id) || []
    arr.push({ date: u.dateObj, status: u.statusNorm })
    unitsById.set(u.id, arr)
  }

  const connections: Connection[] = []
  for (const [pid, hist] of unitsById.entries()) {
    // sort by date (nulls at end)
    const sorted = hist.filter(h => h.date).sort((a,b)=> (a.date!.getTime() - b.date!.getTime()))
    for (let i=0;i<sorted.length-1;i++) {
      const from = sorted[i], to = sorted[i+1]
      if (!from.date || !to.date) continue
      connections.push({
        productId: pid,
        fromDate: new Date(from.date.getFullYear(), from.date.getMonth(), from.date.getDate()),
        toDate: new Date(to.date.getFullYear(), to.date.getMonth(), to.date.getDate()),
        fromStatus: from.status,
        toStatus: to.status
      })
    }
  }

  // output arrays sorted by date
  const days = Array.from(daysMap.values()).sort((a,b)=> a.date.getTime() - b.date.getTime())
  return { days, connections }
}

function isToday(d: Date) {
  const t = new Date()
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()
}
