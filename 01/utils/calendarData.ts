//utils/calendarData
import { ProductUnit, DayData, DayEvent, Connection, ProductStatus } from "../types/calendar";

// Mock product units with status history
export const mockProductUnits: ProductUnit[] = [
  {
    id: "unit-001",
    name: "Product A",
    statusHistory: [
      { status: "CLEAR", date: new Date(2025, 10, 3) },
      { status: "CANDIDATE", date: new Date(2025, 10, 5) },
      { status: "IN_REQUEST", date: new Date(2025, 10, 8) },
      { status: "IN_STORE", date: new Date(2025, 10, 12) },
      { status: "SOLD", date: new Date(2025, 10, 18) },
    ],
  },
  {
    id: "unit-002",
    name: "Product B",
    statusHistory: [
      { status: "CLEAR", date: new Date(2025, 10, 6) },
      { status: "IN_REQUEST", date: new Date(2025, 10, 10) },
      { status: "IN_STORE", date: new Date(2025, 10, 15) },
    ],
  },
  {
    id: "unit-003",
    name: "Product C",
    statusHistory: [
      { status: "CLEAR", date: new Date(2025, 10, 10) },
      { status: "CANDIDATE", date: new Date(2025, 10, 12) },
      { status: "IN_STORE", date: new Date(2025, 10, 20) },
      { status: "SOLD", date: new Date(2025, 10, 25) },
    ],
  },
  {
    id: "unit-004",
    name: "Product D",
    statusHistory: [
      { status: "CLEAR", date: new Date(2025, 10, 15) },
      { status: "CANDIDATE", date: new Date(2025, 10, 17) },
      { status: "IN_REQUEST", date: new Date(2025, 10, 19) },
    ],
  },
  {
    id: "unit-005",
    name: "Product E",
    statusHistory: [
      { status: "CLEAR", date: new Date(2025, 10, 21) },
      { status: "IN_STORE", date: new Date(2025, 10, 23) },
      { status: "SOLD", date: new Date(2025, 10, 27) },
    ],
  },
];

export function generateCalendarDays(year: number, month: number): DayData[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days: DayData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const events = getEventsForDate(currentDate);
    
    days.push({
      date: currentDate,
      events,
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.toDateString() === today.toDateString(),
    });
  }
  
  return days;
}

function getEventsForDate(date: Date): DayEvent[] {
  const dateStr = date.toDateString();
  const eventMap = new Map<ProductStatus, DayEvent>();
  
  mockProductUnits.forEach((unit) => {
    unit.statusHistory.forEach((history) => {
      if (history.date.toDateString() === dateStr) {
        const existing = eventMap.get(history.status);
        if (existing) {
          existing.count++;
          existing.productIds.push(unit.id);
        } else {
          eventMap.set(history.status, {
            status: history.status,
            count: 1,
            productIds: [unit.id],
          });
        }
      }
    });
  });
  
  return Array.from(eventMap.values());
}

export function generateConnections(): Connection[] {
  const connections: Connection[] = [];
  
  mockProductUnits.forEach((unit) => {
    for (let i = 0; i < unit.statusHistory.length - 1; i++) {
      const current = unit.statusHistory[i];
      const next = unit.statusHistory[i + 1];
      
      connections.push({
        fromDate: current.date,
        toDate: next.date,
        productId: unit.id,
        fromStatus: current.status,
        toStatus: next.status,
      });
    }
  });
  
  return connections;
}

export function getDayPosition(date: Date, calendarDays: DayData[]): { row: number; col: number } | null {
  const index = calendarDays.findIndex(
    (day) => day.date.toDateString() === date.toDateString()
  );
  
  if (index === -1) return null;
  
  return {
    row: Math.floor(index / 7),
    col: index % 7,
  };
}
