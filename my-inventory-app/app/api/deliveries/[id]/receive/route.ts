// app/api/deliveries/[id]/receive/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { generateSerialNumber } from '@/app/lib/serialGenerator';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deliveryId = parseInt(params.id);

    // Находим поставку
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        product: true,
        requestItem: true
      }
    });

    if (!delivery) {
      return NextResponse.json(
        { error: 'Поставка не найдена' },
        { status: 404 }
      );
    }

    // Проверяем, не были ли уже созданы единицы для этой поставки
    const existingUnits = await prisma.productUnit.count({
      where: { deliveryId }
    });

    if (existingUnits > 0) {
      return NextResponse.json(
        { error: 'Для этой поставки уже созданы единицы товара' },
        { status: 400 }
      );
    }

    // Проверяем остатки у RequestItem
    const requestItem = await prisma.requestItem.findUnique({
      where: { id: delivery.requestItemId }
    });

    if (!requestItem) {
      return NextResponse.json(
        { error: 'Заявка не найдена' },
        { status: 404 }
      );
    }

    // Нельзя создать больше единиц, чем осталось в заявке
    const remainingQuantity = requestItem.quantity - requestItem.deliveredQuantity;
    if (delivery.quantity > remainingQuantity) {
      return NextResponse.json(
        { error: `Нельзя принять больше ${remainingQuantity} единиц. Остаток в заявке: ${remainingQuantity}` },
        { status: 400 }
      );
    }

    // Создаем ProductUnit для каждой единицы в поставке
    const productUnits = [];
    
    for (let i = 0; i < delivery.quantity; i++) {
      const serialNumber = generateSerialNumber(delivery.product.code);
      
      const productUnit = await prisma.productUnit.create({
        data: {
          serialNumber,
          productId: delivery.productId,
          deliveryId: deliveryId,
          status: 'IN_STORE',
          salePrice: 0
        },
        include: {
          product: true,
          delivery: true
        }
      });
      
      productUnits.push(productUnit);
    }

    // Обновляем deliveredQuantity в RequestItem
    await prisma.requestItem.update({
      where: { id: delivery.requestItemId },
      data: {
        deliveredQuantity: {
          increment: delivery.quantity
        },
        isCompleted: requestItem.quantity <= (requestItem.deliveredQuantity + delivery.quantity)
      }
    });

    // Обновляем статус поставки на "полностью"
    await prisma.delivery.update({
      where: { id: deliveryId },
      data: { status: 'FULL' }
    });

    return NextResponse.json({
      message: `Принято ${delivery.quantity} единиц товара`,
      productUnits,
      updatedRequestItem: await prisma.requestItem.findUnique({
        where: { id: delivery.requestItemId }
      })
    });

  } catch (error) {
    console.error('Ошибка при приемке поставки:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}