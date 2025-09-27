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
  console.log("=== API: CREATE PRODUCT UNIT FROM PRODUCT ===");
  console.log("📦 Запрос на создание ProductUnit");
  
  try {
    const body = await req.json();
    const { productId } = body;

    console.log("📥 Полученные данные:", { productId });

    if (!productId) {
      console.error("❌ Ошибка: productId обязателен");
      return NextResponse.json({ ok: false, error: "productId required" }, { status: 400 });
    }

    console.log("🔍 Поиск продукта в базе...");
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, spine: true, images: true },
    });

    console.log("📋 Найденный продукт:", {
      id: product?.id,
      name: product?.name,
      code: product?.code,
      spineId: product?.spineId,
      spineName: product?.spine?.name,
      categoryId: product?.categoryId,
      categoryName: product?.category?.name
    });

    if (!product) {
      console.error("❌ Ошибка: продукт не найден");
      return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
    }

    if (!product.spineId) {
      console.error("❌ Ошибка: у продукта отсутствует Spine");
      console.log("💡 Информация о продукте:", {
        productId: product.id,
        productName: product.name,
        hasSpine: !!product.spineId,
        spine: product.spine
      });
      return NextResponse.json({
        ok: false,
        error: "У продукта отсутствует Spine. Пересоздайте продукт.",
      }, { status: 400 });
    }

    console.log("✅ Продукт валиден, генерируем серийный номер...");
    const serialNumber = await generateSerialNumber(prisma, productId, null);
    console.log("🔢 Сгенерированный серийный номер:", serialNumber);

    console.log("🔄 Создание ProductUnit в базе...");
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

    console.log("✅ ProductUnit создан:", {
      id: newUnit.id,
      serialNumber: newUnit.serialNumber,
      spineId: newUnit.spineId,
      productId: newUnit.productId
    });

    console.log("📊 Пересчет статистики продукта...");
    await recalcProductUnitStats(productId);

    console.log("🎉 Успешное завершение. Отправка ответа клиенту.");
    return NextResponse.json({ 
      ok: true, 
      data: newUnit 
    });

  } catch (err: any) {
    console.error("💥 Критическая ошибка в API:", {
      error: err.message,
      stack: err.stack,
      name: err.name
    });
    return NextResponse.json({ 
      ok: false, 
      error: err.message 
    }, { status: 500 });
  }
}