/**
 * Преобразует логи юнита в массив:
 * [
 *   { date: Date, status: string, unitId: number }
 * ]
 */
export function normalizeLogs(productUnits: any[]) {
  const events: any[] = []

  for (const unit of productUnits) {
    if (!unit.logs || unit.logs.length === 0) {
      // fallback: используем createdAt
      events.push({
        unitId: unit.id,
        date: new Date(unit.createdAt),
        status: unit.statusCard || "CLEAR"
      })
      continue
    }

    for (const log of unit.logs) {
      events.push({
        unitId: unit.id,
        date: new Date(log.createdAt),
        status: log.statusTo ?? log.status ?? "CLEAR"
      })
    }
  }

  // сортируем по дате
  return events.sort((a, b) => a.date.getTime() - b.date.getTime())
}
