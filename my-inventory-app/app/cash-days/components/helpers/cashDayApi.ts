// app/cash-days/components/helpers/cashDayApi.ts
import { CashDay } from '../types';

export const cashDayApi = {
  async getCurrent(): Promise<CashDay | null> {
    const response = await fetch("/api/cash-days/current");
    const data = await response.json();
    return data.ok ? data.data : null;
  },

  async open(): Promise<boolean> {
    const response = await fetch("/api/cash-days", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data.ok;
  },

  async close(cashDayId: number): Promise<boolean> {
    const response = await fetch(`/api/cash-days/${cashDayId}/close`, {
      method: "POST",
    });
    const data = await response.json();
    return data.ok;
  },

  async returnProduct(productUnitId: number, returnReason: string): Promise<boolean> {
    const response = await fetch(`/api/product-units/${productUnitId}/return`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ returnReason })
    });
    const data = await response.json();
    return data.ok;
  }
};