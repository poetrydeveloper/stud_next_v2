// app/api/product-units/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generateSerialNumber } from "@/app/lib/serialGenerator";

const MAX_SERIAL_RETRIES = 5;

export async function POST(req: Request) {
  try {
    const { productId, deliveryId, quantity = 1 } = await req.json();

    const [product, delivery] = await Promise.all([
      prisma.product.findUnique({ where: { id: Number(productId) } }),
      prisma.delivery.findUnique({ where: { id: Number(deliveryId) } }),
    ]);

    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }
    if (!delivery) {
      return NextResponse.json({ error: "Поставка не найдена" }, { status: 404 });
    }

    // Проверяем, сколько единиц можно ещё создать
    const existingCount = await prisma.productUnit.count({
      where: { deliveryId: Number(deliveryId) },
    });

    const remaining = delivery.quantity - existingCount;
    if (remaining <= 0) {
      return NextResponse.json(
        {
          error: "Все единицы для этой поставки уже созданы",
          deliveryQuantity: delivery.quantity,
          existingCount,
        },
        { status: 400 }
      );
    }

    const finalQuantity = Math.min(quantity, remaining);
    const createdUnits: any[] = [];

    // Транзакция: создаём все юниты или ничего
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < finalQuantity; i++) {
        let unitCreated = false;
        let attempts = 0;

        while (!unitCreated && attempts < MAX_SERIAL_RETRIES) {
          attempts++;
          const serial = generateSerialNumber({
            productCode: product.code,
            deliveryPrice: delivery.pricePerUnit.toString(),
          });

          try {
            const unit = await tx.productUnit.create({
              data: {
                serialNumber: serial,
                productId: product.id,
                deliveryId: delivery.id,
                status: "IN_STORE",
                salePrice: 0,
              },
              include: {
                product: {
                  include: {
                    category: true,
                    images: true // Добавлено включение images
                  }
                },
                delivery: true,
              },
            });
            createdUnits.push(unit);
            unitCreated = true;
          } catch (err: any) {
            if (err.code === "P2002" && err.meta?.target?.includes("serial_number")) {
              // Конфликт серийника — пробуем заново
              continue;
            }
            throw err;
          }
        }

        if (!unitCreated) {
          throw new Error(
            `Не удалось создать уникальный серийный номер после ${MAX_SERIAL_RETRIES} попыток`
          );
        }
      }
    });

    return NextResponse.json(
      {
        message: `Создано ${createdUnits.length} единиц товара`,
        deliveryId: delivery.id,
        productId: product.id,
        createdCount: createdUnits.length,
        productUnits: createdUnits,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка создания единиц товара:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера", detail: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const deliveryId = searchParams.get("deliveryId");
    const status = searchParams.get("status");

    const where: any = {
      ...(productId && { productId: Number(productId) }),
      ...(deliveryId && { deliveryId: Number(deliveryId) }),
      ...(status && { status }),
    };

    const units = await prisma.productUnit.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
            images: true // ДОБАВЛЕНО: включаем изображения продуктов
          }
        },
        delivery: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(units);
  } catch (error) {
    console.error("Ошибка получения единиц товара:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}