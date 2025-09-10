// app/api/deliveries/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { requestItemId, quantity, extraShipment = false, notes } = await req.json();

    // 1. Проверим существование позиции заявки
    const requestItem = await prisma.requestItem.findUnique({
      where: { id: Number(requestItemId) },
      include: {
        product: true,
        supplier: true,
        customer: true,
        request: true,
      },
    });

    if (!requestItem) {
      return NextResponse.json({ error: "Позиция заявки не найдена" }, { status: 404 });
    }

    // 2. Проверка остатка
    const remaining = requestItem.quantity - requestItem.deliveredQuantity;
    if (!extraShipment && quantity > remaining) {
      return NextResponse.json(
        { error: `Максимально можно поставить ${remaining} единиц` },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json({ error: "Количество должно быть больше 0" }, { status: 400 });
    }

    // 3. Определяем статус
    let status: "PARTIAL" | "FULL" | "OVER" | "EXTRA" = "PARTIAL";
    if (extraShipment) {
      status = "EXTRA";
    } else if (quantity < remaining) {
      status = "PARTIAL";
    } else if (quantity === remaining) {
      status = "FULL";
    } else if (quantity > remaining) {
      status = "OVER";
    }

    // 4. Создаем запись поставки
    const delivery = await prisma.delivery.create({
      data: {
        requestItemId: Number(requestItemId),
        deliveryDate: new Date(),
        quantity,
        extraShipment,
        notes,

        // Автоматически копируем данные из заявки
        supplierName: requestItem.supplier?.name || "Неизвестный поставщик",
        customerName: requestItem.customer?.name || "Неизвестный покупатель",
        productId: requestItem.product.id,
        requestDate: requestItem.request?.createdAt || new Date(),
        extraRequest: requestItem.status === "EXTRA",
        pricePerUnit: requestItem.pricePerUnit,

        status,
      },
    });

    // 5. Обновляем deliveredQuantity в RequestItem
    await prisma.requestItem.update({
      where: { id: Number(requestItemId) },
      data: {
        deliveredQuantity: requestItem.deliveredQuantity + quantity,
        isCompleted: requestItem.deliveredQuantity + quantity >= requestItem.quantity,
      },
    });

    return NextResponse.json(delivery, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании поставки:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера при создании поставки" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    
    // Сделать дату необязательной - показывать сегодня по умолчанию
    const targetDate = date || new Date().toISOString().split('T')[0];

    const startOfDay = new Date(`${targetDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${targetDate}T23:59:59.999Z`);

    const deliveries = await prisma.delivery.findMany({
      where: {
        deliveryDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        product: true,
        requestItem: {
          include: {
            supplier: true,
            customer: true,
          }
        }
      },
      orderBy: { deliveryDate: "asc" },
    });

    const totalSum = deliveries.reduce(
      (sum, d) => sum + Number(d.pricePerUnit) * d.quantity,
      0
    );

    return NextResponse.json({ 
      deliveries, 
      totalSum,
      date: targetDate 
    });
  } catch (error) {
    console.error("Ошибка при получении поставок:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера при получении поставок" },
      { status: 500 }
    );
  }
}
