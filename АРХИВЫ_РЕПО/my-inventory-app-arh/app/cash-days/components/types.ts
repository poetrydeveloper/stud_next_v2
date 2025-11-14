// app/cash-days/components/types.ts
export interface CashEvent {
  id: number;
  type: string;
  amount: number;
  notes: string;
  createdAt: string;
  productUnit?: {
    id: number;
    serialNumber: string;
    productName?: string;
    productCode?: string;
    salePrice?: number;
    product?: {
      name: string;
      code: string;
      images?: Array<{
        path: string;
        isMain: boolean;
      }>;
    };
  };
}

export interface CashDay {
  id: number;
  date: string;
  isClosed: boolean;
  total: number;
  events: CashEvent[];
}