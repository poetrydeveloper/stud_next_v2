// app/api/cash-events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { CreateCashEventRequest } from '@/app/lib/types/cash';

export async function POST(request: NextRequest) {
  try {
    const body: CreateCashEventRequest = await request.json();

    // Проверяем, что кассовый день существует и открыт
    const cashDay = await prisma.cashDay.findUnique({
      where: { id: body.cashDayId }
    });

    if (!cashDay) {
      return NextResponse.json(
        { error: 'Кассовый день не найден' },
        { status: 404 }
      );
    }

    if (cashDay.isClosed) {
      return NextResponse.json(
        { error: 'Кассовый день закрыт' },
        { status: 400 }
      );
    }

    // Если это продажа, обновляем productUnit
    if (body.type === 'SALE' && body.productUnitId) {
      await prisma.productUnit.update({
        where: { id: body.productUnitId },
        data: {
          status: 'SOLD',
          salePrice: body.amount,
          soldAt: new Date()
        }
      });
    }

    // Создаем событие
    const cashEvent = await prisma.cashEvent.create({
      data: {
        type: body.type,
        amount: body.amount,
        notes: body.notes,
        cashDayId: body.cashDayId,
        productUnitId: body.productUnitId
      },
      include: {
        productUnit: {
          include: {
            product: true
          }
        }
      }
    });

    // Обновляем общую сумму кассового дня
    const updatedCashDay = await prisma.cashDay.update({
      where: { id: body.cashDayId },
      data: {
        total: { increment: body.amount }
      }
    });

    return NextResponse.json(cashEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating cash event:', error);
    return NextResponse.json(
      { error: 'Ошибка создания кассового события' },
      { status: 500 }
    );
  }
}