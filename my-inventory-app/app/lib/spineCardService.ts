// app/lib/spineCardService.ts
import { ProductUnitCardStatus } from "@prisma/client";

export interface ApiResult {
  success: boolean;
  error?: string;
  data?: any;
}

export class SpineCardService {
  /**
   * Добавить unit в кандидаты
   */
  static async addToCandidate(unitId: number): Promise<ApiResult> {
    try {
      const res = await fetch("/api/product-units", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, quantity: 1 }),
      });

      const data = await res.json();
      
      if (data.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Неизвестная ошибка" };
      }
    } catch (error: any) {
      return { success: false, error: "Ошибка сети: " + error.message };
    }
  }

  /**
   * Создать заявку для unit
   */
  static async createRequest(unitId: number, quantity: number): Promise<ApiResult> {
    try {
      const res = await fetch("/api/product-units/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, quantity }),
      });

      const data = await res.json();
      
      if (data.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Неизвестная ошибка" };
      }
    } catch (error: any) {
      return { success: false, error: "Ошибка сети: " + error.message };
    }
  }

  /**
   * Показать уведомление (можно заменить на toast библиотеку позже)
   */
  static showNotification(message: string, isError: boolean = false) {
    // Временное решение - alert, потом заменить на toast
    if (isError) {
      console.error("Ошибка:", message);
      alert(`Ошибка: ${message}`);
    } else {
      console.log("Успех:", message);
      // Можно добавить toast уведомление
    }
  }
}