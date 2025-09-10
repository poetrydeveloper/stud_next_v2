// app/api/product-units/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generateSerialNumber } from "@/app/lib/serialGenerator";

export async function POST(req: Request) {
  try {
    const { productId, deliveryId, quantity = 1 } = await req.json();

    // Проверяем существование продукта и поставки
    const [product, delivery] = await Promise.all([
      prisma.product.findUnique({ where: { id: Number(productId) } }),
      prisma.delivery.findUnique({ 
        where: { id: Number(deliveryId) },
        include: { product: true }
      })
    ]);

    if (!product) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }

    if (!delivery) {
      return NextResponse.json(
        { error: "Поставка не найдена" },
        { status: 404 }
      );
    }

    const productUnits = [];

    // Создаем указанное количество единиц товара
    for (let i = 0; i < quantity; i++) {
      const serialNumber = generateSerialNumber({
        productCode: product.code,
        deliveryPrice: delivery.pricePerUnit.toString()
      });

      const productUnit = await prisma.productUnit.create({
        data: {
          serialNumber,
          productId: Number(productId),
          deliveryId: Number(deliveryId)
        }
      });

      productUnits.push(productUnit);
    }

    return NextResponse.json(
      { 
        message: `Создано ${quantity} единиц товара`,
        productUnits 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Ошибка создания единиц товара:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// GET - получение единиц товара
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const deliveryId = searchParams.get('deliveryId');

    const whereClause = {
      ...(productId && { productId: Number(productId) }),
      ...(deliveryId && { deliveryId: Number(deliveryId) })
    };

    const productUnits = await prisma.productUnit.findMany({
      where: whereClause,
      include: {
        product: true,
        delivery: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(productUnits);
  } catch (error) {
    console.error("Ошибка получения единиц товара:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
