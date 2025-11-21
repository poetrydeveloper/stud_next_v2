// app/components/movement-board/figma-calendar/adapter.tsx
import { ProductUnit, DayData, Connection, ProductStatus } from './types'

/**
 * УЛУЧШЕННЫЙ АДАПТЕР С ПОЛНЫМ МЕСЯЧНЫМ КАЛЕНДАРЕМ
 */

function toStatus(status?: string): ProductStatus {
  if (!status) return 'CLEAR'
  
  const norm = String(status).toUpperCase()
  
  if (norm.includes('CANDIDATE') || norm === 'CANDIDATE') return 'CANDIDATE'
  if (norm.includes('REQUEST') || norm === 'IN_REQUEST') return 'IN_REQUEST'
  if (norm.includes('DELIVERY') || norm === 'IN_DELIVERY') return 'IN_DELIVERY'
  if (norm.includes('ARRIVED') || norm === 'ARRIVED') return 'ARRIVED'
  if (norm.includes('STORE') || norm === 'IN_STORE') return 'IN_STORE'
  if (norm === 'SOLD' || norm.includes('SOLD')) return 'SOLD'
  if (norm === 'CREDIT' || norm.includes('CREDIT')) return 'CREDIT'
  if (norm === 'LOST' || norm.includes('LOST')) return 'LOST'
  
  return 'CLEAR'
}

/**
 * ДОПОЛНИТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ИЗВЛЕЧЕНИЯ СТАТУСА ИЗ СООБЩЕНИЯ
 */
function extractStatusFromMessage(message: string): string | null {
  if (!message) return null
  
  const statusMap: Record<string, string> = {
    'CLEAR': 'CLEAR',
    'CANDIDATE': 'CANDIDATE', 
    'SPROUTED': 'SPROUTED',
    'IN_REQUEST': 'IN_REQUEST',
    'IN_DELIVERY': 'IN_DELIVERY',
    'ARRIVED': 'ARRIVED',
    'IN_STORE': 'IN_STORE',
    'SOLD': 'SOLD',
    'CREDIT': 'CREDIT',
    'LOST': 'LOST'
  }
  
  for (const [key, value] of Object.entries(statusMap)) {
    if (message.toUpperCase().includes(key)) {
      return value
    }
  }
  
  return null
}

/**
 * СОЗДАЕМ ИСТОРИЮ СТАТУСОВ ДЛЯ СВЯЗЕЙ
 */
function createStatusHistory(unit: any): { date: Date; status: ProductStatus }[] {
  const history = []
  
  // ✅ ОСНОВНАЯ ДАТА СОЗДАНИЯ (всегда есть)
  if (unit.createdAt) {
    history.push({
      date: new Date(unit.createdAt),
      status: toStatus(unit.statusCard || unit.statusProduct || 'CLEAR')
    })
  }
  
  // ✅ ДОБАВЛЯЕМ ЛОГИ ЕСЛИ ЕСТЬ
  if (unit.logs && Array.isArray(unit.logs)) {
    unit.logs.forEach((log: any) => {
      if (log.createdAt) {
        const logStatus = toStatus(
          log.meta?.newStatus || 
          log.meta?.previousStatus || 
          extractStatusFromMessage(log.message) ||
          unit.statusCard || 
          unit.statusProduct
        )
        
        history.push({
          date: new Date(log.createdAt),
          status: logStatus
        })
      }
    })
  }
  
  // ✅ ДОБАВЛЯЕМ ТЕКУЩИЙ СТАТУС ЕСЛИ НЕТ ЛОГОВ (для создания связей)
  if (history.length === 1 && (unit.statusCard || unit.statusProduct)) {
    history.push({
      date: new Date(), // текущая дата
      status: toStatus(unit.statusCard || unit.statusProduct)
    })
  }
  
  // ✅ СОРТИРУЕМ ПО ДАТЕ
  return history.sort((a, b) => a.date.getTime() - b.date.getTime())
}

/**
 * СОЗДАЕМ ПОЛНЫЙ МЕСЯЧНЫЙ КАЛЕНДАРЬ
 */
function createFullMonthCalendar(year: number, month: number): DayData[] {
  const days: DayData[] = []
  
  // Первый день месяца
  const firstDay = new Date(year, month, 1)
  // Последний день месяца
  const lastDay = new Date(year, month + 1, 0)
  
  // День недели первого дня (0 - воскресенье, 1 - понедельник, etc.)
  const firstDayOfWeek = firstDay.getDay()
  
  // Начинаем с понедельника (если первый день не понедельник, добавляем предыдущие дни)
  const startDate = new Date(firstDay)
  startDate.setDate(firstDay.getDate() - (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1))
  
  // Создаем 42 дня (6 недель) для полного календаря
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    
    const isCurrentMonth = currentDate.getMonth() === month
    const isToday = isTodayDate(currentDate)
    
    days.push({
      date: new Date(currentDate),
      events: [], // пустые события, заполнятся позже
      isCurrentMonth,
      isToday
    })
  }
  
  return days
}

/**
 * ЗАПОЛНЯЕМ КАЛЕНДАРЬ РЕАЛЬНЫМИ ДАННЫМИ
 */
function populateCalendarWithData(calendarDays: DayData[], productUnits: ProductUnit[]): DayData[] {
  const padISO = (d: Date) => d.toISOString().slice(0, 10)
  
  // Создаем карту дней по датам для быстрого доступа
  const daysMap = new Map<string, DayData>()
  calendarDays.forEach(day => {
    daysMap.set(padISO(day.date), day)
  })
  
  // Заполняем данными из productUnits
  for (const unit of productUnits) {
    if (!unit.createdAt) continue
    
    const unitDate = new Date(unit.createdAt)
    const dateKey = padISO(unitDate)
    const dayData = daysMap.get(dateKey)
    
    if (dayData) {
      const status = toStatus(unit.statusCard || unit.statusProduct)
      const existingEvent = dayData.events.find(e => e.status === status)
      
      if (existingEvent) {
        existingEvent.count += 1
        existingEvent.productIds.push(unit.id)
      } else {
        dayData.events.push({
          status,
          count: 1,
          productIds: [unit.id]
        })
      }
    }
  }
  
  return calendarDays
}

export function buildCalendarData(productUnits: ProductUnit[], monthAnchor?: Date) {
  console.log('🎯 DEBUG ADAPTER: Начало построения календаря')
  console.log('📊 DEBUG ADAPTER: Количество units:', productUnits?.length)
  
  if (!productUnits || productUnits.length === 0) {
    console.log('⚠️ DEBUG ADAPTER: Нет данных для построения')
    return { days: [], connections: [] }
  }

  // Используем переданный месяц или текущий
  const anchorDate = monthAnchor || new Date()
  const year = anchorDate.getFullYear()
  const month = anchorDate.getMonth()
  
  console.log('📅 DEBUG ADAPTER: Строим календарь для:', year, month + 1)
  
  // 1. СОЗДАЕМ ПОЛНЫЙ МЕСЯЧНЫЙ КАЛЕНДАРЬ
  const fullMonthCalendar = createFullMonthCalendar(year, month)
  console.log('🗓️ DEBUG ADAPTER: Создан календарь на', fullMonthCalendar.length, 'дней')
  
  // 2. ЗАПОЛНЯЕМ ДАННЫМИ
  const populatedCalendar = populateCalendarWithData(fullMonthCalendar, productUnits)
  
  // 3. ФИЛЬТРУЕМ ТОЛЬКО ДНИ С СОБЫТИЯМИ ИЛИ ТЕКУЩИЙ МЕСЯЦ
  const daysWithEvents = populatedCalendar.filter(day => 
    day.events.length > 0 || day.isCurrentMonth
  )
  
  console.log('✅ DEBUG ADAPTER: Дней с событиями:', daysWithEvents.filter(d => d.events.length > 0).length)

  // 4. СТРОИМ СВЯЗИ МЕЖДУ СТАТУСАМИ
  const units = productUnits.map(u => ({
    ...u,
    statusHistory: createStatusHistory(u)
  }))

  const connections: Connection[] = []
  
  for (const unit of units) {
    if (unit.statusHistory.length < 2) {
      console.log(`🔗 DEBUG ADAPTER: Unit ${unit.id} - недостаточно истории для связей`)
      continue
    }
    
    for (let i = 0; i < unit.statusHistory.length - 1; i++) {
      const from = unit.statusHistory[i]
      const to = unit.statusHistory[i + 1]
      
      if (!from.date || !to.date) continue
      
      connections.push({
        productId: unit.id,
        fromDate: new Date(from.date.getFullYear(), from.date.getMonth(), from.date.getDate()),
        toDate: new Date(to.date.getFullYear(), to.date.getMonth(), to.date.getDate()),
        fromStatus: from.status,
        toStatus: to.status
      })
    }
  }

  console.log('✅ DEBUG ADAPTER: Календарь построен:', {
    totalDays: populatedCalendar.length,
    daysWithEvents: daysWithEvents.filter(d => d.events.length > 0).length,
    connectionsCount: connections.length,
    month: `${year}-${month + 1}`
  })
  
  return { 
    days: daysWithEvents, 
    connections,
    monthInfo: {
      year,
      month,
      monthName: new Date(year, month).toLocaleString('ru-RU', { month: 'long' }),
      totalDays: populatedCalendar.length
    }
  }
}

function isTodayDate(d: Date) {
  const today = new Date()
  return d.getFullYear() === today.getFullYear() && 
         d.getMonth() === today.getMonth() && 
         d.getDate() === today.getDate()
}