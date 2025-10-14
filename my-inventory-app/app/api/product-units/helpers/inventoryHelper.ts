// app/api/product-units/helpers/inventoryHelper.ts
import prisma from "@/app/lib/prisma";

/**
 * Получить остатки товаров по статусу
 */
export async function getInventoryByStatus(status?: string) {
  const where: any = {};
  
  if (status) {
    where.statusProduct = status;
  }

  const productUnits = await prisma.productUnit.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });

  // Группируем остатки по коду товара
  const inventoryMap = new Map();
  
  productUnits.forEach((unit) => {
    const code = unit.productCode || unit.product?.code;
    if (code) {
      inventoryMap.set(code, (inventoryMap.get(code) || 0) + 1);
    }
  });

  return inventoryMap;
}

/**
 * Получить остатки товаров с группировкой по коду
 */
export async function getGroupedInventory(status?: string) {
  const inventoryMap = await getInventoryByStatus(status);
  
  // Преобразуем Map в массив объектов для удобства
  const groupedInventory = Array.from(inventoryMap.entries()).map(([code, count]) => ({
    code,
    count
  }));

  return groupedInventory;
}