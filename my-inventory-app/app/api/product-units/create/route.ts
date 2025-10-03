// app/api/product-units/create/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitCardStatus } from "@prisma/client";
import { generateSerialNumber, recalcProductUnitStats, copyProductDataToUnit } from "@/app/api/product-units/helpers";

export async function POST(req: Request) {
  console.log("=== API: CREATE PRODUCT UNIT FROM PRODUCT ===");
  
  try {
    const body = await req.json();
    const { productId, supplierId, requestPricePerUnit } = body; // ✅ ДОБАВЛЕНО supplierId

    console.log("📥 Полученные данные:", { productId, supplierId, requestPricePerUnit });

    if (!productId) {
      return NextResponse.json({ ok: false, error: "productId required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, spine: true, images: true, brand: true },
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

    // ✅ ИСПРАВЛЕНО: копируем ВСЕ данные
    const unitData = {
      productId: product.id,
      spineId: product.spineId,
      supplierId: supplierId || null, // ✅ ДОБАВЛЕНО
      ...copyProductDataToUnit(product), // копируем данные продукта
      serialNumber,
      statusCard: ProductUnitCardStatus.CLEAR,
      requestPricePerUnit: requestPricePerUnit || null, // ✅ ДОБАВЛЕНО
      logs: {
        create: {
          type: "SYSTEM",
          message: `Unit автоматически создан из продукта ${product.name}`,
        },
      },
    };

    const newUnit = await prisma.productUnit.create({
      data: unitData,
      include: { logs: true, supplier: true, spine: true },
    });

    await recalcProductUnitStats(productId);

    return NextResponse.json({ 
      ok: true, 
      data: newUnit 
    });

  } catch (err: any) {
    console.error("💥 Ошибка в API:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}