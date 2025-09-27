// app/lib/requestService.ts
import { PrismaClient, ProductUnitCardStatus } from '@prisma/client';
import { generateSerialNumber, appendLog, recalcProductUnitStats } from '@/app/api/product-units/helpers';

const prisma = new PrismaClient();

export interface CreateRequestResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class RequestService {
  /**
   * Создание заявки для product unit
   */
  static async createRequest(unitId: number, quantity: number): Promise<CreateRequestResult> {
    console.log("🚀 Запуск создания заявки:", { unitId, quantity });
    
    try {
      // Находим родительскую unit
      console.log("🔍 Поиск родительской unit:", unitId);
      const parentUnit = await prisma.productUnit.findUnique({
        where: { id: unitId },
        include: { product: true }
      });

      if (!parentUnit) {
        console.error("❌ Родительская unit не найдена");
        return { success: false, error: "ProductUnit not found" };
      }

      console.log("📋 Данные родительской unit:", {
        id: parentUnit.id,
        statusCard: parentUnit.statusCard,
        productId: parentUnit.productId,
        productName: parentUnit.productName
      });

      if (parentUnit.statusCard !== ProductUnitCardStatus.CANDIDATE) {
        console.error("❌ Unit не является кандидатом:", parentUnit.statusCard);
        return { success: false, error: "Unit is not a candidate" };
      }

      if (quantity === 1) {
        console.log("🔸 Создание заявки для 1 единицы");
        return await this.createSingleRequest(parentUnit);
      } else {
        console.log("🔸 Создание заявки для нескольких единиц:", quantity);
        return await this.createMultipleRequests(parentUnit, quantity);
      }

    } catch (error: any) {
      console.error("💥 Критическая ошибка в createRequest:", {
        error: error.message,
        stack: error.stack
      });
      return { success: false, error: error.message };
    }
  }

  /**
   * Создание заявки для одной единицы
   */
  private static async createSingleRequest(parentUnit: any): Promise<CreateRequestResult> {
    try {
      console.log("📝 Обновление статуса unit на IN_REQUEST");
      
      const updatedUnit = await prisma.productUnit.update({
        where: { id: parentUnit.id },
        data: {
          statusCard: ProductUnitCardStatus.IN_REQUEST,
          quantityInRequest: 1,
          createdAtRequest: new Date(),
          logs: appendLog(parentUnit.logs || [], {
            event: "MOVED_TO_REQUEST",
            at: new Date().toISOString(),
            quantity: 1,
            type: "SINGLE"
          }),
        },
      });

      console.log("✅ Unit обновлена:", updatedUnit.id);

      await recalcProductUnitStats(parentUnit.productId);
      console.log("📊 Статистика продукта пересчитана");

      return { 
        success: true, 
        data: { 
          type: "single",
          unit: updatedUnit 
        } 
      };

    } catch (error: any) {
      console.error("❌ Ошибка создания одиночной заявки:", error);
      throw error;
    }
  }

  /**
   * Создание заявки для нескольких единиц (sprouted logic)
   */
  private static async createMultipleRequests(parentUnit: any, quantity: number): Promise<CreateRequestResult> {
    console.log("🌱 Запуск sprouted логики для количества:", quantity);
    
    try {
      // 1. Обновляем родительскую unit в статус SPROUTED
      console.log("🔄 Обновление родительской unit в SPROUTED");
      const sproutedUnit = await prisma.productUnit.update({
        where: { id: parentUnit.id },
        data: {
          statusCard: ProductUnitCardStatus.SPROUTED,
          logs: appendLog(parentUnit.logs || [], {
            event: "SPROUTED",
            at: new Date().toISOString(),
            quantity: quantity,
            childrenCount: quantity,
            type: "MULTIPLE"
          }),
        },
      });

      console.log("✅ Родительская unit обновлена:", sproutedUnit.id);

      // 2. Создаем дочерние units
      console.log("👶 Создание дочерних units...");
      const childUnits = [];

      for (let i = 1; i <= quantity; i++) {
        console.log(`🔄 Создание дочерней unit ${i}/${quantity}`);
        
        const serialNumber = await generateSerialNumber(prisma, parentUnit.productId, parentUnit.id, i, quantity);
        
        console.log("🔢 Сгенерирован серийный номер:", serialNumber);

        const childUnit = await prisma.productUnit.create({
          data: {
            productId: parentUnit.productId,
            spineId: parentUnit.spineId,
            parentProductUnitId: parentUnit.id,
            productCode: parentUnit.productCode,
            productName: parentUnit.productName,
            productDescription: parentUnit.productDescription,
            productCategoryId: parentUnit.productCategoryId,
            productCategoryName: parentUnit.productCategoryName,
            serialNumber,
            statusCard: ProductUnitCardStatus.IN_REQUEST,
            quantityInRequest: 1,
            createdAtRequest: new Date(),
            requestPricePerUnit: parentUnit.requestPricePerUnit,
            logs: appendLog([], {
              event: "CREATED_FROM_SPROUTED",
              at: new Date().toISOString(),
              parentUnitId: parentUnit.id,
              index: i,
              total: quantity,
              sproutedFrom: parentUnit.serialNumber
            }),
          },
        });

        console.log("✅ Дочерняя unit создана:", childUnit.id);
        childUnits.push(childUnit);
      }

      // 3. Проверяем корректность создания
      console.log("🔍 Проверка корректности создания...");
      const createdCount = childUnits.length;
      if (createdCount !== quantity) {
        console.error("❌ Несоответствие количества созданных units:", {
          expected: quantity,
          created: createdCount
        });
        // Можно добавить откат транзакции здесь
      } else {
        console.log("✅ Все дочерние units созданы корректно");
      }

      // 4. Обновляем статистику
      await recalcProductUnitStats(parentUnit.productId);
      console.log("📊 Статистика продукта пересчитана");

      return { 
        success: true, 
        data: { 
          type: "multiple",
          sprouted: sproutedUnit,
          children: childUnits,
          childrenCount: childUnits.length
        } 
      };

    } catch (error: any) {
      console.error("❌ Ошибка создания множественной заявки:", error);
      throw error;
    }
  }
}