// app/api/product-units/helpers.ts/
import { PrismaClient } from "@prisma/client";

import { prisma } from '@/app/lib/prisma';

/**
 * Генерация серийного номера для ProductUnit
 */
export async function generateSerialNumber(
  prisma: PrismaClient,
  productId: number,
  parentProductUnitId?: number
): Promise<string> {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  const now = new Date();
  const pad = (num: number, size: number = 2) => num.toString().padStart(size, "0");
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${pad(now.getMilliseconds(), 3)}`;

  // Генерируем случайный 6-значный номер
  const randomPart = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");

  if (!parentProductUnitId) {
    return `${product.code}-${datePart}-${timePart}-${randomPart}`;
  }

  const parent = await prisma.productUnit.findUnique({ where: { id: parentProductUnitId } });
  if (!parent) throw new Error("Parent unit not found");

  // Для дочерних юнитов добавляем индекс
  const childrenCount = await prisma.productUnit.count({ where: { parentProductUnitId } });
  return `${parent.serialNumber}/${childrenCount + 1}`;
}

/**
 * Создание или получение CashDay ID для даты
 */
export async function getOrCreateCashDayId(tx: any, date: Date): Promise<number> {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const existing = await tx.cashDay.findUnique({ where: { date: d } });
  if (existing) return existing.id;

  const created = await tx.cashDay.create({ data: { date: d } });
  return created.id;
}

/**
 * Пересчет статистики продукта
 */
export async function recalcProductUnitStats(productId: number): Promise<{
  inStoreCount: number;
  inCandidatesCount: number;
}> {
  const prisma = new PrismaClient();

  try {
    // Считаем количество юнитов в магазине и в кандидатах
    const [inStoreCount, inCandidatesCount] = await Promise.all([
      prisma.productUnit.count({ 
        where: { 
          productId, 
          statusProduct: "IN_STORE" 
        } 
      }),
      prisma.productUnit.count({ 
        where: { 
          productId, 
          statusCard: "CANDIDATE" 
        } 
      }),
    ]);

    return { inStoreCount, inCandidatesCount };
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Полное копирование данных родительского ProductUnit для создания дочернего
 */
export function copyParentUnitData(parentUnit: any, additionalData: any = {}): any {
  return {
    // Основные связи
    productId: parentUnit.productId,
    spineId: parentUnit.spineId,
    supplierId: parentUnit.supplierId,
    customerId: parentUnit.customerId,
    parentProductUnitId: parentUnit.id,
    
    // Дублируемые данные из Product
    productCode: parentUnit.productCode,
    productName: parentUnit.productName, 
    productDescription: parentUnit.productDescription,
    productCategoryId: parentUnit.productCategoryId,
    productCategoryName: parentUnit.productCategoryName,
    productTags: parentUnit.productTags,
    
    // Данные для заявки
    requestPricePerUnit: parentUnit.requestPricePerUnit,
    
    // Статусы
    statusCard: "IN_REQUEST",
    statusProduct: null,
    
    // Даты
    createdAtRequest: new Date(),
    
    // Дополнительные данные (количество и т.д.)
    ...additionalData
  };
}

/**
 * Копирование данных продукта в ProductUnit (денормализация)
 */
export function copyProductDataToUnit(product: any): any {
  return {
    productCode: product.code,
    productName: product.name,
    productDescription: product.description || "",
    productCategoryId: product.categoryId,
    productCategoryName: product.category?.name,
    productTags: product.tags || null
  };
}

/**
 * Создание лога для ProductUnit (стандартизированный формат)
 */
export function createProductUnitLog(
  productUnitId: number,
  type: string,
  message: string,
  meta?: any
): any {
  return {
    productUnitId,
    type,
    message,
    meta: meta || {},
    createdAt: new Date()
  };
}

/**
 * Валидация данных ProductUnit перед созданием/обновлением
 */
export function validateProductUnitData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.productId) {
    errors.push("Product ID is required");
  }

  if (!data.serialNumber) {
    errors.push("Serial number is required");
  }

  if (data.serialNumber && typeof data.serialNumber !== 'string') {
    errors.push("Serial number must be a string");
  }

  if (data.serialNumber && data.serialNumber.length > 100) {
    errors.push("Serial number too long (max 100 characters)");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Проверка допустимых переходов статусов ProductUnit
 */
export function isValidStatusTransition(
  currentStatus: string, 
  newStatus: string
): boolean {
  const allowedTransitions: Record<string, string[]> = {
    'CLEAR': ['CANDIDATE', 'SPROUTED'],
    'CANDIDATE': ['IN_REQUEST', 'CLEAR'],
    'SPROUTED': ['IN_REQUEST'],
    'IN_REQUEST': ['IN_DELIVERY', 'CLEAR'],
    'IN_DELIVERY': ['IN_STORE'],
    'IN_STORE': ['SOLD', 'CREDIT', 'LOST'],
    'SOLD': ['IN_STORE'], // возврат
    'CREDIT': ['SOLD', 'IN_STORE'], // оплата кредита или возврат
    'LOST': ['IN_STORE'] // найден
  };

  return allowedTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Расчет общей стоимости заявки для ProductUnit
 */
export function calculateRequestTotal(
  quantity: number,
  pricePerUnit: number | null
): number {
  if (!pricePerUnit) return 0;
  return quantity * pricePerUnit;
}

/**
 * Форматирование данных ProductUnit для ответа API
 */
export function formatProductUnitResponse(unit: any): any {
  return {
    id: unit.id,
    serialNumber: unit.serialNumber,
    statusCard: unit.statusCard,
    statusProduct: unit.statusProduct,
    product: unit.product ? {
      id: unit.product.id,
      name: unit.product.name,
      code: unit.product.code,
      brand: unit.product.brand,
      category: unit.product.category
    } : null,
    spine: unit.spine ? {
      id: unit.spine.id,
      name: unit.spine.name
    } : null,
    supplier: unit.supplier,
    customer: unit.customer,
    salePrice: unit.salePrice,
    soldAt: unit.soldAt,
    isCredit: unit.isCredit,
    createdAt: unit.createdAt,
    updatedAt: unit.updatedAt
  };
}

/**
 * Обновляет brandData в Spine при создании/изменении Unit
 */
export async function updateSpineBrandData(
  spineId: number, 
  brandInfo: {
    brandName: string;
    displayName: string;
    imagePath: string | null;
    productCode: string;
  }
): Promise<void> {
  try {
    const spine = await prisma.spine.findUnique({ 
      where: { id: spineId } 
    });

    if (!spine) {
      console.warn(`❌ Spine ${spineId} not found`);
      return;
    }

    // Безопасная работа с brandData
    let currentBrandData: any = {};
    
    if (spine.brandData && typeof spine.brandData === 'object') {
      currentBrandData = { ...spine.brandData };
    }

    // Обновляем или добавляем данные бренда
    currentBrandData[brandInfo.brandName] = {
      displayName: brandInfo.displayName,
      imagePath: brandInfo.imagePath,
      productCode: brandInfo.productCode,
      updatedAt: new Date().toISOString()
    };

    await prisma.spine.update({
      where: { id: spineId },
      data: { brandData: currentBrandData }
    });
    
    console.log(`✅ Spine ${spineId} updated with brand: ${brandInfo.brandName}`);
    
  } catch (error) {
    console.error('❌ Error updating spine brand data:', error);
    // НЕ выбрасываем ошибку, чтобы не ломать создание unit
  }
}

/**
 * Создание множественной заявки с дочерними юнитами
 */
export async function createMultipleRequest(
  parentUnitId: number,
  quantity: number,
  pricePerUnit: number
): Promise<{ parentUnit: any; childUnits: any[] }> {
  const prisma = new PrismaClient();

  try {
    console.log("🔄 Создание множественной заявки:", {
      parentUnitId,
      quantity,
      pricePerUnit
    });

    return await prisma.$transaction(async (tx) => {
      // 1. Обновляем родительский юнит
      const parentUnit = await tx.productUnit.update({
        where: { id: parentUnitId },
        data: {
          statusCard: "IN_REQUEST",
          quantityInRequest: quantity,
          requestPricePerUnit: pricePerUnit,
          createdAtRequest: new Date(),
        },
        include: {
          logs: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      // 2. Создаем дочерние юниты
      const childUnits = [];
      for (let i = 0; i < quantity; i++) {
        const childSerialNumber = `${parentUnit.serialNumber}/${i + 1}`;
        
        const childUnit = await tx.productUnit.create({
          data: {
            productId: parentUnit.productId,
            spineId: parentUnit.spineId,
            supplierId: parentUnit.supplierId,
            parentProductUnitId: parentUnitId,
            
            // Копируем данные
            productCode: parentUnit.productCode,
            productName: parentUnit.productName,
            productDescription: parentUnit.productDescription,
            productCategoryId: parentUnit.productCategoryId,
            productCategoryName: parentUnit.productCategoryName,
            productTags: parentUnit.productTags,
            
            // Данные заявки
            serialNumber: childSerialNumber,
            statusCard: "IN_REQUEST",
            requestPricePerUnit: pricePerUnit,
            quantityInRequest: 1,
            createdAtRequest: new Date(),
            
            // Логируем создание
            logs: {
              create: {
                type: "REQUEST_CHILD_CREATED",
                message: `Дочерний юнит заявки создан из родителя #${parentUnit.serialNumber}`,
                meta: {
                  parentUnitId: parentUnit.id,
                  requestPrice: pricePerUnit,
                  childIndex: i + 1
                }
              }
            }
          },
          include: {
            logs: {
              orderBy: { createdAt: 'desc' }
            }
          }
        });
        
        childUnits.push(childUnit);
      }

      // 3. Логируем в родительском юните
      await tx.productUnitLog.create({
        data: {
          productUnitId: parentUnitId,
          type: "MULTIPLE_REQUEST_CREATED",
          message: `Создана множественная заявка на ${quantity} единиц по ${pricePerUnit} руб.`,
          meta: {
            childrenCount: quantity,
            pricePerUnit: pricePerUnit,
            totalAmount: quantity * pricePerUnit
          }
        }
      });

      console.log("✅ Множественная заявка создана:", {
        parentUnit: parentUnit.serialNumber,
        childrenCount: childUnits.length
      });

      return { parentUnit, childUnits };
    });

  } catch (error) {
    console.error("💥 Ошибка создания множественной заявки:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}