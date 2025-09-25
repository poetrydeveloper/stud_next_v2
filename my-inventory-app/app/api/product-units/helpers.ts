//app/api/product-units/helpers.ts

import { PrismaClient } from "@prisma/client";

export function appendLog(existing: any, entry: any) {
  let arr: any[] = [];
  if (Array.isArray(existing)) arr = existing;
  arr.push(entry);
  return arr;
}

export async function generateSerialNumber(
  prisma: PrismaClient,
  productId: number,
  parentProductUnitId?: number
) {
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

export async function getOrCreateCashDayId(tx: any, date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const existing = await tx.cashDay.findUnique({ where: { date: d } });
  if (existing) return existing.id;

  const created = await tx.cashDay.create({ data: { date: d } });
  return created.id;
}

export async function recalcProductUnitStats(productId: number) {
  const prisma = new PrismaClient();

  try {
    // Считаем количество юнитов в магазине и в кандидатах (на лету)
    const [inStoreCount, inCandidatesCount] = await Promise.all([
      prisma.productUnit.count({ where: { productId, statusProduct: "IN_STORE" } }),
      prisma.productUnit.count({ where: { productId, statusCard: "CANDIDATE" } }),
    ]);

    // Возвращаем данные для аналитики или отображения
    return { inStoreCount, inCandidatesCount };
  } finally {
    await prisma.$disconnect();
  }
}
