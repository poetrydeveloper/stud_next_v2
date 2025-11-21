// app/components/movement-board/figma-calendar/types.ts
export type ProductStatus = 'CLEAR' | 'CANDIDATE' | 'IN_REQUEST' | 'IN_DELIVERY' | 'ARRIVED' | 'IN_STORE' | 'SOLD' | 'CREDIT' | 'LOST';

export interface ProductUnit {
  id: string | number;
  serialNumber?: string;
  statusCard?: string;
  statusProduct?: string;
  createdAt: string;
  updatedAt: string;
  logs?: any[];
}

export interface DayEvent {
  status: ProductStatus;
  count: number;
  productIds: (string | number)[];
}

export interface DayData {
  date: Date;
  events: DayEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface Connection {
  fromDate: Date;
  toDate: Date;
  productId: string | number;
  fromStatus: ProductStatus;
  toStatus: ProductStatus;
}

// ✅ ДОБАВЛЕНО ДЛЯ МЕСЯЧНОЙ ИНФОРМАЦИИ
export interface MonthInfo {
  year: number;
  month: number;
  monthName: string;
  totalDays: number;
}

export interface CalendarData {
  days: DayData[];
  connections: Connection[];
  monthInfo: MonthInfo;
}