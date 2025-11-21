// types content placeholder
// app/components/movement-board/figma-calendar/types.ts
export type ProductStatus = 'CLEAR' | 'CANDIDATE' | 'IN_REQUEST' | 'IN_STORE' | 'SOLD';

export interface ProductUnit {
  id: string | number;
  serialNumber?: string;
  status?: string;
  date?: string; // ISO date string
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
