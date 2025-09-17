//app/api/product-units/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { ProductUnitStatus } from '@/app/lib/types/productUnit';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, salePrice } = await request.json();
    const id = parseInt(params.id);

    // Валидация статуса
    if (status && !['IN_STORE', 'SOLD', 'LOST'].includes(status)) {
      return NextResponse.json(
        { error: 'Неверный статус' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (status) {
      updateData.status = status as ProductUnitStatus;
      
      // Автоматически устанавливаем дату продажи при изменении статуса на SOLD
      if (status === 'SOLD') {
        updateData.soldAt = new Date();
      } else if (status !== 'SOLD') {
        // Сбрасываем дату продажи если статус меняется с SOLD
        updateData.soldAt = null;
      }
    }

    if (salePrice !== undefined) {
      if (salePrice < 0) {
        return NextResponse.json(
          { error: 'Цена не может быть отрицательной' },
          { status: 400 }
        );
      }
      updateData.salePrice = salePrice;
    }

    const productUnit = await prisma.productUnit.update({
      where: { id },
      data: updateData,
      include: {
        product: {
          include: {
            category: true,
            images: {
              where: { isMain: true },
              take: 1
            }
          }
        },
        delivery: true
      }
    });

    return NextResponse.json(productUnit);
  } catch (error) {
    console.error('Error updating product unit:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const productUnit = await prisma.productUnit.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            category: true,
            images: {
              where: { isMain: true },
              take: 1
            }
          }
        },
        delivery: true
      }
    });

    if (!productUnit) {
      return NextResponse.json(
        { error: 'Единица товара не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(productUnit);
  } catch (error) {
    console.error('Error fetching product unit:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}