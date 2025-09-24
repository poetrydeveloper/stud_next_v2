//app/api/product-units/route.ts

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generateSerialNumber, recalcProductUnitStats, appendLog } from "@/app/api/product-units/helpers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");

  const where: any = {};
  if (productId) where.productId = Number(productId);

  const units = await prisma.productUnit.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { product: true },
  });

  return NextResponse.json({ ok: true, data: units });
}

/**
 * POST /api/product-units
 * Создание единицы товара (ProductUnit).
 * Поддержка parentProductUnitId и количества >1.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, deliveryId, parentProductUnitId, requestPricePerUnit, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ ok: false, error: "productId required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });
    if (!product) return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });

    const createdUnits = [];

    for (let i = 0; i < quantity; i++) {
      const serialNumber = await generateSerialNumber(prisma, productId, parentProductUnitId);

      const unit = await prisma.productUnit.create({
        data: {
          productId,
          deliveryId,
          parentProductUnitId,
          productCode: product.code,
          productName: product.name,
          productDescription: product.description,
          productCategoryId: product.categoryId,
          productCategoryName: product.category?.name,
          serialNumber,
          statusCard: deliveryId ? "IN_DELIVERY" : "IN_REQUEST",
          statusProduct: deliveryId ? "IN_STORE" : null,
          requestPricePerUnit,
          logs: appendLog([], {
            event: "UNIT_CREATED",
            at: new Date().toISOString(),
            source: deliveryId ? "delivery" : "manual",
            parentId: parentProductUnitId ?? null,
            index: i + 1,
            total: quantity,
          }),
        },
      });

      createdUnits.push(unit);
    }

    await recalcProductUnitStats(productId);

    return NextResponse.json({ ok: true, data: createdUnits });
  } catch (err: any) {
    console.error("POST /api/product-units error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
