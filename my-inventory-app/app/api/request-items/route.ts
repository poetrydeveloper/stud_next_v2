// app/api/request-items/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// POST /api/request-items
// body: { productId: number, status?: string, quantity?: number, pricePerUnit?: string|number, supplierId?: number, customerId?: number }
export async function POST(req: Request) {
  try {
    const {
      productId,
      status = "CANDIDATE",
      quantity = 1,
      pricePerUnit = "0",
      supplierId,
      customerId
    } = await req.json();

    // Проверим, что товар существует
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    });
    if (!product) {
      return NextResponse.json(
        { error: "Продукт не найден" },
        { status: 404 }
      );
    }

    // Если поставщик не указан, создаем или находим "Неизвестный поставщик"
    let finalSupplierId = supplierId;
    if (!finalSupplierId) {
      let defaultSupplier = await prisma.supplier.findFirst({
        where: { name: "Неизвестный поставщик" }
      });

      if (!defaultSupplier) {
        defaultSupplier = await prisma.supplier.create({
          data: {
            name: "Неизвестный поставщик",
            contactPerson: "Не указано",
            phone: "Не указано",
          },
        });
      }

      finalSupplierId = defaultSupplier.id;
    }

    // Проверим, есть ли уже RequestItem с этим продуктом и активным статусом
    const existingItem = await prisma.requestItem.findFirst({
      where: {
        productId: Number(productId),
        status: { in: ["CANDIDATE", "IN_REQUEST", "EXTRA"] },
      },
    });

    let item;

    if (existingItem) {
      // Обновляем существующий
      item = await prisma.requestItem.update({
        where: { id: existingItem.id },
        data: {
          status: status.toUpperCase(),
          quantity: Number(quantity) || 1,
          pricePerUnit: pricePerUnit?.toString() ?? "0",
          supplierId: finalSupplierId,
          customerId: customerId || null,
        },
        include: {
          product: true,
          supplier: true,
          customer: true,
        },
      });
    } else {
      // Создаем новый
      item = await prisma.requestItem.create({
        data: {
          productId: product.id,
          status: status.toUpperCase(),
          quantity: Number(quantity) || 1,
          pricePerUnit: pricePerUnit?.toString() ?? "0",
          supplierId: finalSupplierId,
          customerId: customerId || null,
          requestId: null,
        },
        include: {
          product: true,
          supplier: true,
          customer: true,
        },
      });
    }

    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error("Ошибка в POST /api/request-items:", e);
    return NextResponse.json(
      { error: "Не удалось обновить позицию" },
      { status: 500 }
    );
  }
}

// GET /api/request-items?status=candidate|in_request|extra
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = (searchParams.get("status") || "candidate").toUpperCase();

    const allowed = ["CANDIDATE", "IN_REQUEST", "EXTRA"];
    const status = allowed.includes(statusParam) ? statusParam : "CANDIDATE";

    const items = await prisma.requestItem.findMany({
      where: { status },
      include: {
        product: {
          include: {
            images: true,
            category: true,
          },
        },
        request: true,
        supplier: true,
        customer: true,
      },
      orderBy: { id: "desc" },
    });

    // Добавляем вычисляемые поля
    const withComputed = items.map((it) => ({
      ...it,
      totalCost: (Number(it.pricePerUnit) * it.quantity).toString(),
      remainingQuantity: Math.max(0, it.quantity - it.deliveredQuantity),
      deliveryProgress: `${it.deliveredQuantity}/${it.quantity}`,
      supplierName: it.supplier?.name || null,
      customerName: it.customer?.name || null,
    }));

    return NextResponse.json(withComputed);
  } catch (e) {
    console.error("Ошибка в GET /api/request-items:", e);
    return NextResponse.json(
      { error: "Не удалось получить позиции" },
      { status: 500 }
    );
  }
}
