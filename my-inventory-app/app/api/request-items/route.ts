// app/api/request-items/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// POST /api/request-items
// body: { productId: number, status?: string, quantity?: number, pricePerUnit?: string|number, supplier?: string, customer?: string }
export async function POST(req: Request) {
  try {
    const { 
      productId, 
      status = "CANDIDATE", 
      quantity = 1, 
      pricePerUnit = "0", 
      supplier, 
      customer,
      supplierId,    // НОВОЕ: ID поставщика
      customerId     // НОВОЕ: ID заказчика
    } = await req.json();

    // Проверим, что товар существует
    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
    if (!product) return NextResponse.json({ error: "Продукт не найден" }, { status: 404 });

    // НОВОЕ: Получим "Неизвестный поставщик" по умолчанию
    let defaultSupplier = null;
    if (!supplierId) {
      defaultSupplier = await prisma.supplier.findFirst({
        where: { name: "Неизвестный поставщик" }
      });
      
      // Если нет - создадим
      if (!defaultSupplier) {
        defaultSupplier = await prisma.supplier.create({
          data: {
            name: "Неизвестный поставщик",
            contactPerson: "Не указано",
            phone: "Не указано"
          }
        });
      }
    }

    // Проверим существующий item
    const existingItem = await prisma.requestItem.findFirst({
      where: { 
        productId: Number(productId),
        status: { in: ["CANDIDATE", "IN_REQUEST", "EXTRA"] }
      }
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
          // СТАРОЕ: для обратной совместимости
          supplier: supplier || existingItem.supplier,
          customer: customer || existingItem.customer,
          // НОВОЕ: связи с поставщиками и заказчиками
          supplierId: supplierId || defaultSupplier?.id || null,
          customerId: customerId || null,
        },
        include: { 
          product: true,
          supplier: true,    // НОВОЕ: включаем поставщика
          customer: true     // НОВОЕ: включаем заказчика
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
          // СТАРОЕ: для обратной совместимости
          supplier: supplier || "неизвестный поставщик",
          customer: customer || "покупатель",
          // НОВОЕ: связи с поставщиками и заказчиками
          supplierId: supplierId || defaultSupplier?.id || null,
          customerId: customerId || null,
          requestId: null,
        },
        include: { 
          product: true,
          supplier: true,    // НОВОЕ: включаем поставщика
          customer: true     // НОВОЕ: включаем заказчика
        },
      });
    }

    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Не удалось обновить позицию" }, { status: 500 });
  }
}

// GET /api/request-items?status=candidate|in_request|extra
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = (searchParams.get("status") || "candidate").toUpperCase();

    const allowed = ["CANDIDATE", "IN_REQUEST", "EXTRA"];
    const status = allowed.includes(statusParam) ? (statusParam as any) : "CANDIDATE";

    const items = await prisma.requestItem.findMany({
      where: { status },
      include: {
        product: {
          include: { 
            images: true, 
            category: true 
          },
        },
        request: true,
        // НОВОЕ: включаем поставщиков и заказчиков
        supplier: true,
        customer: true
      },
      orderBy: { id: "desc" },
    });

    // добавляем вычисляемые поля
    const withComputed = items.map((it) => ({
      ...it,
      totalCost: (Number(it.pricePerUnit) * it.quantity).toString(), // строкой (Decimal)
      remainingQuantity: Math.max(0, it.quantity - it.deliveredQuantity),
      deliveryProgress: `${it.deliveredQuantity}/${it.quantity}`,
      // СТАРОЕ: для обратной совместимости
      supplier: it.supplier?.name || it.supplier, // используем имя поставщика или старое текстовое поле
      customer: it.customer?.name || it.customer  // используем имя заказчика или старое текстовое поле
    }));

    return NextResponse.json(withComputed);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Не удалось получить позиции" }, { status: 500 });
  }
}
