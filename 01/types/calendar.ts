//types/calendar.ts
export type ProductStatus = 'CLEAR' | 'CANDIDATE' | 'IN_REQUEST' | 'IN_STORE' | 'SOLD';

export interface ProductUnit {
  id: string;
  name: string;
  statusHistory: {
    status: ProductStatus;
    date: Date;
  }[];
}

export interface DayEvent {
  status: ProductStatus;
  count: number;
  productIds: string[];
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
  productId: string;
  fromStatus: ProductStatus;
  toStatus: ProductStatus;
}
