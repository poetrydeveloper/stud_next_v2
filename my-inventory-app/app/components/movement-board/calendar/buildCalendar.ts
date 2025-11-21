import { StatusColors } from "./statusMap"

/**
 * Строим календарь за месяц
 */
export function buildCalendar(selectedMonth: Date, events: any[]) {
  const year = selectedMonth.getFullYear()
  const month = selectedMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days = []
  const totalDays = lastDay.getDate()

  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d)
    const dailyEvents = events.filter(
      (e) => e.date.toDateString() === date.toDateString()
    )

    days.push({
      date,
      events: dailyEvents
    })
  }

  // линии между логами
  const lines = []

  const groupedByUnit = new Map<number, any[]>()
  events.forEach(ev => {
    if (!groupedByUnit.has(ev.unitId)) groupedByUnit.set(ev.unitId, [])
    groupedByUnit.get(ev.unitId)!.push(ev)
  })

  for (const [unitId, unitEvents] of groupedByUnit.entries()) {
    for (let i = 0; i < unitEvents.length - 1; i++) {
      lines.push({
        unitId,
        from: unitEvents[i].date,
        to: unitEvents[i + 1].date,
        color: StatusColors[unitEvents[i + 1].status] || "#000",
      })
    }
  }

  return { days, lines }
}
