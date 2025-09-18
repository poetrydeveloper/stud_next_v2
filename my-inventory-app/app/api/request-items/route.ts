// app/api/request-items/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

// Функция для подсчёта статистики товара
async function computeStatsForProduct(productId: number) {
  // 1) В заявках
  const reqAgg = await prisma.requestItem.aggregate({
    _sum: { quantity: true },
    where: {
      productId,
      status: { in: ["CANDIDATE", "IN_REQUEST"] },
    },
  });
  const inRequests = Number(reqAgg._sum.quantity ?? 0);

  // 2) На складе
  const inStore = await prisma.productUnit.count({
    where: { productId, status: "IN_STORE" },
  });

  // 3) Продано сегодня
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const soldToday = await prisma.productUnit.count({
    where: {
      productId,
      status: "SOLD",
      soldAt: { gte: startOfDay },
    },
  });

  return { inRequests, inStore, soldToday };
}

// POST - создание новой позиции в заявке
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantity, pricePerUnit, status = "CANDIDATE", supplierId, customerId } = body;

    if (!productId || !quantity) {
      return NextResponse.json({ error: "productId and quantity are required" }, { status: 400 });
    }

    // Валидация quantity
    const quantityNumber = Number(quantity);
    if (quantityNumber <= 0) {
      return NextResponse.json(
        { error: "Количество должно быть больше 0" },
        { status: 400 }
      );
    }

    // Валидация pricePerUnit
    const priceNumber = Number(pricePerUnit || 0);
    if (priceNumber < 0) {
      return NextResponse.json(
        { error: "Цена не может быть отрицательной" },
        { status: 400 }
      );
    }

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
          quantity: quantityNumber,
          pricePerUnit: new Prisma.Decimal(priceNumber).toString(),
          supplierId: finalSupplierId,
          customerId: customerId || null,
        },
        include: {
          product: {
            include: {
              images: true,
              category: true,
            },
          },
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
          quantity: quantityNumber,
          pricePerUnit: new Prisma.Decimal(priceNumber).toString(),
          supplierId: finalSupplierId,
          customerId: customerId || null,
          requestId: null,
        },
        include: {
          product: {
            include: {
              images: true,
              category: true,
            },
          },
          supplier: true,
          customer: true,
        },
      });
    }

    // Считаем свежую статистику для продукта
    const stats = await computeStatsForProduct(Number(productId));

    return NextResponse.json({
      message: "Request item created successfully",
      item: {
        ...item,
        totalCost: (Number(item.pricePerUnit) * item.quantity).toString(),
        remainingQuantity: Math.max(0, item.quantity - (item.deliveredQuantity || 0)),
        deliveryProgress: `${item.deliveredQuantity || 0}/${item.quantity}`,
        supplierName: item.supplier?.name || null,
        customerName: item.customer?.name || null,
      },
      stats: {
        ...stats,
        lastUpdated: new Date().toISOString(),
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating request item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET - получение позиций с фильтрацией по статусу
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
        supplier: true,
        customer: true,
      },
      orderBy: { id: "desc" },
    });

    // Добавляем вычисляемые поля
    const itemsWithComputed = items.map((it) => ({
      ...it,
      totalCost: (Number(it.pricePerUnit) * it.quantity).toString(),
      remainingQuantity: Math.max(0, it.quantity - (it.deliveredQuantity || 0)),
      deliveryProgress: `${it.deliveredQuantity || 0}/${it.quantity}`,
      supplierName: it.supplier?.name || null,
      customerName: it.customer?.name || null,
    }));

    return NextResponse.json(itemsWithComputed);

  } catch (e) {
    console.error("Ошибка в GET /api/request-items:", e);
    return NextResponse.json(
      { error: "Не удалось получить позиции" },
      { status: 500 }
    );
  }
}

// DELETE - удаление позиции
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID позиции обязателен" },
        { status: 400 }
      );
    }

    await prisma.requestItem.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Позиция удалена успешно" });

  } catch (e) {
    console.error("Ошибка в DELETE /api/request-items:", e);
    return NextResponse.json(
      { error: "Не удалось удалить позицию" },
      { status: 500 }
    );
  }
}

// PATCH - обновление позиции
export async function PATCH(req: Request) {
  try {
    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID позиции обязателен" },
        { status: 400 }
      );
    }

    const item = await prisma.requestItem.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        product: {
          include: {
            images: true,
            category: true,
          },
        },
        supplier: true,
        customer: true,
      },
    });

    // Добавляем вычисляемые поля
    const itemWithComputed = {
      ...item,
      totalCost: (Number(item.pricePerUnit) * item.quantity).toString(),
      remainingQuantity: Math.max(0, item.quantity - (item.deliveredQuantity || 0)),
      deliveryProgress: `${item.deliveredQuantity || 0}/${item.quantity}`,
      supplierName: item.supplier?.name || null,
      customerName: item.customer?.name || null,
    };

    return NextResponse.json(itemWithComputed);

  } catch (e) {
    console.error("Ошибка в PATCH /api/request-items:", e);
    return NextResponse.json(
      { error: "Не удалось обновить позицию" },
      { status: 500 }
    );
  }
}