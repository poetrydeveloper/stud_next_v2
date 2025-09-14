// app/api/cash-days/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const cashDay = await prisma.cashDay.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            productUnit: {
              include: {
                product: true,
                delivery: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!cashDay) {
      return NextResponse.json(
        { error: 'Кассовый день не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(cashDay);
  } catch (error) {
    console.error('Error fetching cash day:', error);
    return NextResponse.json(
      { error: 'Ошибка получения кассового дня' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { isClosed } = await request.json();

    const cashDay = await prisma.cashDay.update({
      where: { id },
      data: { isClosed },
      include: {
        events: true
      }
    });

    return NextResponse.json(cashDay);
  } catch (error) {
    console.error('Error updating cash day:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления кассового дня' },
      { status: 500 }
    );
  }
}