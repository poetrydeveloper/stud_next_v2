//app/api/super-add/roure.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      categoryName,
      spineName,
      productName,
      productSku,
      description,
      photoUrl,
      brandId,
      createUnit = true,
      setCandidate = true,
      orderData // { qty, price }
    } = data;

    const resultLog: any = {};

    // 1) Категория
    let category = await prisma.category.findFirst({ where: { name: categoryName }});
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName }});
      resultLog.category = `✅ категория создана`;
    } else {
      resultLog.category = `ℹ️ категория уже есть`;
    }

    // 2) Spine
    let spine = await prisma.spine.findFirst({ where: { name: spineName }});
    if (!spine) {
      spine = await prisma.spine.create({ data: { name: spineName, categoryId: category.id }});
      resultLog.spine = `✅ spine создан`;
    } else {
      resultLog.spine = `ℹ️ spine уже есть`;
    }

    // 3) Product
    const product = await prisma.product.create({
      data: {
        name: productName,
        sku: productSku,
        description,
        photoUrl,
        brandId,
        spineId: spine.id,
      }
    });
    resultLog.product = `✅ product создан`;

    let productUnit = null;

    // 4) Product Unit (если включено)
    if (createUnit) {
      productUnit = await prisma.productUnit.create({
        data: {
          productId: product.id,
          status: setCandidate ? "CANDIDATE" : "NEW",
        },
      });
      resultLog.unit = `✅ unit создан со статусом ${productUnit.status}`;
    }

    // 5) Order (если данные переданы)
    if (orderData && productUnit) {
      const order = await prisma.order.create({
        data: {
          productUnitId: productUnit.id,
          quantity: orderData.qty,
          unitPrice: orderData.price,
        },
      });
      resultLog.order = `✅ заказ создан (x${orderData.qty})`;
    }

    return NextResponse.json({ success: true, log: resultLog });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
