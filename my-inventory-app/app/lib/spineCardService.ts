// app/lib/spineCardService.ts
import { ProductUnitCardStatus } from "@prisma/client";

export interface ApiResult {
  success: boolean;
  error?: string;
  data?: any;
}

export class SpineCardService {
  /**
   * Добавить unit в кандидаты (с созданием нового CLEAR unit)
   */
  static async addToCandidate(unitId: number): Promise<ApiResult> {
    try {
      console.log("🔄 [1] Начинаем перевод unit в кандидаты...", unitId);

      // 1. Получаем информацию о CLEAR unit
      console.log("🔄 [2] Получаем информацию о CLEAR unit...");
      const unitRes = await fetch(`/api/product-units/${unitId}`);
      console.log("📡 [2a] Response status:", unitRes.status);
      
      const unitData = await unitRes.json();
      console.log("📦 [2b] Response data:", unitData);
      
      if (!unitData.ok) {
        console.error("❌ [2c] Unit не найден");
        return { success: false, error: "Unit не найден" };
      }

      const clearUnit = unitData.data;
      console.log("✅ [2d] Найден CLEAR unit:", clearUnit.serialNumber);

      // 2. Создаем НОВЫЙ CLEAR unit для замены через существующий эндпоинт
      console.log("🔄 [3] Создаем новый CLEAR unit через /api/product-units/create...");
      
      const clonePayload = {
        cloneFromUnitId: clearUnit.id
      };
      console.log("📦 [3a] Payload для клонирования:", clonePayload);

      const newClearRes = await fetch("/api/product-units/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clonePayload),
      });

      console.log("📡 [3b] Response status:", newClearRes.status);
      
      // Проверяем если response не OK
      if (!newClearRes.ok) {
        const errorText = await newClearRes.text();
        console.error("❌ [3c] HTTP Error:", newClearRes.status, errorText);
        return { success: false, error: `HTTP ${newClearRes.status}: ${errorText}` };
      }

      const newClearData = await newClearRes.json();
      console.log("📦 [3d] Response data:", newClearData);
      
      if (!newClearData.ok) {
        console.error("❌ [3e] Ошибка создания нового CLEAR unit:", newClearData.error);
        return { success: false, error: "Не удалось создать новый CLEAR unit: " + newClearData.error };
      }

      console.log("✅ [3f] Новый CLEAR unit создан:", newClearData.data.serialNumber);

      // 3. Переводим старый unit в CANDIDATE
      console.log("🔄 [4] Переводим старый unit в CANDIDATE...");
      
      const candidatePayload = { 
        unitId, 
        quantity: 1,
        action: "to_candidate" 
      };
      console.log("📦 [4a] Payload для кандидата:", candidatePayload);

      const candidateRes = await fetch("/api/product-units", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidatePayload),
      });

      console.log("📡 [4b] Response status:", candidateRes.status);
      
      // Проверяем если response не OK
      if (!candidateRes.ok) {
        const errorText = await candidateRes.text();
        console.error("❌ [4c] HTTP Error:", candidateRes.status, errorText);
        return { success: false, error: `HTTP ${candidateRes.status}: ${errorText}` };
      }

      const candidateData = await candidateRes.json();
      console.log("📦 [4d] Response data:", candidateData);
      
      if (candidateData.ok) {
        console.log("✅ [4e] Успешно переведен в CANDIDATE");
        return { 
          success: true, 
          data: {
            candidateUnit: candidateData.data,
            newClearUnit: newClearData.data
          }
        };
      } else {
        console.error("❌ [4f] Ошибка перевода в кандидаты:", candidateData.error);
        return { success: false, error: candidateData.error || "Неизвестная ошибка при переводе в кандидаты" };
      }
    } catch (error: any) {
      console.error("💥 [5] Критическая ошибка в addToCandidate:", error);
      console.error("💥 [5a] Stack trace:", error.stack);
      return { success: false, error: "Ошибка сети: " + error.message };
    }
  }

  /**
   * Создать заявку для unit (с ценой за единицу)
   */
  static async createRequest(unitId: number, quantity: number, pricePerUnit: number): Promise<ApiResult> {
    try {
      console.log("📋 [SERVICE] === НАЧАЛО createRequest ===");
      console.log("📋 [SERVICE] Параметры:", { unitId, quantity, pricePerUnit, type: typeof pricePerUnit });
      
      // ✅ ПРОВЕРКА ЦЕНЫ В СЕРВИСЕ
      if (!pricePerUnit || pricePerUnit <= 0) {
        console.error("❌ [SERVICE] Цена невалидна:", pricePerUnit);
        return { success: false, error: "Цена должна быть больше 0" };
      }

      // Определяем тип заявки
      if (quantity === 1) {
        console.log("🔄 [SERVICE] Одиночная заявка");
        
        const res = await fetch("/api/product-units/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unitId, quantity, pricePerUnit }), // ✅ ПЕРЕДАЕМ ЦЕНУ
        });

        console.log("📡 [SERVICE] Response status:", res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ [SERVICE] HTTP Error:", res.status, errorText);
          return { success: false, error: `HTTP ${res.status}: ${errorText}` };
        }

        const data = await res.json();
        console.log("📦 [SERVICE] Response data:", data);
        
        if (data.ok) {
          console.log("✅ [SERVICE] Одиночная заявка создана успешно");
          return { success: true, data };
        } else {
          console.error("❌ [SERVICE] Ошибка создания одиночной заявки:", data.error);
          return { success: false, error: data.error || "Неизвестная ошибка" };
        }
      } else {
        console.log("🔄 [SERVICE] Множественная заявка (SPROUTED)");
        
        // Для множественной заявки создаем массив requests
        const requests = [{ quantity, pricePerUnit }];
        
        const res = await fetch(`/api/product-units/${unitId}/sprout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requests }),
        });

        console.log("📡 [SERVICE] Response status:", res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ [SERVICE] HTTP Error:", res.status, errorText);
          return { success: false, error: `HTTP ${res.status}: ${errorText}` };
        }

        const data = await res.json();
        console.log("📦 [SERVICE] Response data:", data);
        
        if (data.ok) {
          console.log("✅ [SERVICE] Множественная заявка создана успешно");
          return { success: true, data };
        } else {
          console.error("❌ [SERVICE] Ошибка создания множественной заявки:", data.error);
          return { success: false, error: data.error || "Неизвестная ошибка" };
        }
      }
    } catch (error: any) {
      console.error("💥 [SERVICE] Ошибка сети при создании заявки:", error);
      return { success: false, error: "Ошибка сети: " + error.message };
    }
  }

  /**
   * Удалить кандидата
   */
  static async deleteCandidate(unitId: number): Promise<ApiResult> {
    try {
      console.log("🗑️ [1] Удаляем кандидата:", unitId);
      
      const res = await fetch(`/api/product-units/${unitId}/candidate`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      console.log("📡 [2] Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ [3] HTTP Error:", res.status, errorText);
        return { success: false, error: `HTTP ${res.status}: ${errorText}` };
      }

      const data = await res.json();
      console.log("📦 [4] Response data:", data);
      
      if (data.ok) {
        console.log("✅ [5] Кандидат удален");
        return { success: true, data };
      } else {
        console.error("❌ [6] Ошибка удаления кандидата:", data.error);
        return { success: false, error: data.error || "Неизвестная ошибка" };
      }
    } catch (error: any) {
      console.error("💥 [7] Ошибка сети при удалении кандидата:", error);
      return { success: false, error: "Ошибка сети: " + error.message };
    }
  }

  /**
   * Показать уведомление
   */
  static showNotification(message: string, isError: boolean = false) {
    if (isError) {
      console.error("❌ Ошибка:", message);
      alert(`❌ Ошибка: ${message}`);
    } else {
      console.log("✅ Успех:", message);
      alert(`✅ ${message}`);
    }
  }
}