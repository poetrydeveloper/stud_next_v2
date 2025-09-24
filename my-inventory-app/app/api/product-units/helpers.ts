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
  if (!parentProductUnitId) {
    const count = await prisma.productUnit.count({ where: { productId } });
    return `P${productId}-${count + 1}`;
  }

  const parent = await prisma.productUnit.findUnique({ where: { id: parentProductUnitId } });
  if (!parent) throw new Error("Parent unit not found");

  const childrenCount = await prisma.productUnit.count({
    where: { parentProductUnitId },
  });

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

  const [inStoreCount, inRequestsCount] = await Promise.all([
    prisma.productUnit.count({ where: { productId, statusProduct: "IN_STORE" } }),
    prisma.productUnit.count({ where: { productId, statusCard: "IN_REQUEST" } }),
  ]);

  await prisma.productUnit.updateMany({
    where: { productId },
    data: { storeStock: inStoreCount, inRequests: inRequestsCount },
  });

  await prisma.$disconnect();
}
