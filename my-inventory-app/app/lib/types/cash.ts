// app/lib/types/cash.ts
import { ProductUnit } from './productUnit';

export type CashEventType = 'SALE' | 'RETURN' | 'PRICE_QUERY' | 'ORDER' | 'OTHER';

export interface CashDay {
  id: number;
  date: string;
  isClosed: boolean;
  total: number;
  createdAt: string;
  updatedAt: string;
  events: CashEvent[];
}

export interface CashEvent {
  id: number;
  type: CashEventType;
  amount: number;
  notes?: string;
  cashDayId: number;
  productUnitId?: number;
  createdAt: string;
  productUnit?: ProductUnit;
}

export interface CreateCashDayRequest {
  date: string;
}

export interface CreateCashEventRequest {
  type: CashEventType;
  amount: number;
  notes?: string;
  cashDayId: number;
  productUnitId?: number;
}

export interface CloseCashDayRequest {
  id: number;
}