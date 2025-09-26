// app/api/product-unit/create-from-product/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitCardStatus } from "@prisma/client";
import { generateSerialNumber, appendLog, recalcProductUnitStats } from "../helpers";

/**
 * POST /api/product-unit/create-from-product
 * body: { productId: number }
 * Автоматическое создание ProductUnit на основе Product
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ ok: false, error: "productId required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, spine: true, images: true },
    });

    if (!product) {
      return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
    }

    if (!product.spineId) {
      return NextResponse.json({
        ok: false,
        error: "У продукта отсутствует Spine. Пересоздайте продукт.",
      }, { status: 400 });
    }

    const serialNumber = await generateSerialNumber(prisma, productId, null);

    const newUnit = await prisma.productUnit.create({
      data: {
        productId: product.id,
        spineId: product.spineId,
        productCode: product.code,
        productName: product.name,
        productDescription: product.description,
        productCategoryId: product.categoryId,
        productCategoryName: product.category?.name,
        serialNumber,
        statusCard: ProductUnitCardStatus.CLEAR,
        logs: appendLog([], {
          event: "AUTO_CREATED_FROM_PRODUCT",
          at: new Date().toISOString(),
          spineId: product.spineId,
        }),
      },
    });

    await recalcProductUnitStats(productId);

    return NextResponse.json({ ok: true, data: newUnit });
  } catch (err: any) {
    console.error("POST /api/product-unit/create-from-product error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
