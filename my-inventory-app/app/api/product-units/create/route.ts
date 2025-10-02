//app/api/product-unit/create/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitCardStatus } from "@prisma/client";
import { generateSerialNumber, recalcProductUnitStats } from "../helpers";

/**
 * POST 
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

    if (!product) {
      console.error("❌ Ошибка: продукт не найден");
      return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
    }

    if (!product.spineId) {
      console.error("❌ Ошибка: у продукта отсутствует Spine");
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
        productDescription: product.description || "",
        productCategoryId: product.categoryId,
        productCategoryName: product.category?.name,
        serialNumber,
        statusCard: ProductUnitCardStatus.CLEAR,

        // ✅ Логи создаем через nested create без spineId
        logs: {
          create: [
            {
              type: "SYSTEM",
              message: `Unit автоматически создан из продукта ${product.name}`,
              createdAt: new Date(),
            },
          ],
        },
      },
      include: { logs: true },
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
    return NextResponse.json({ ok: true, data: newUnit });

  } catch (err: any) {
    console.error("💥 Критическая ошибка в API:", {
      error: err.message,
      stack: err.stack,
      name: err.name
    });
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
