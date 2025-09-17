// app/api/cash-days/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { CreateCashDayRequest } from '@/app/lib/types/cash';

export async function GET() {
  try {
    const cashDays = await prisma.cashDay.findMany({
      include: {
        events: {
          include: {
            productUnit: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(cashDays);
  } catch (error) {
    console.error('Error fetching cash days:', error);
    return NextResponse.json(
      { error: 'Ошибка получения кассовых дней' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCashDayRequest = await request.json();
    
    // Базовая валидация тела запроса
    if (!body.date) {
      return NextResponse.json(
        { error: 'Поле date обязательно' },
        { status: 400 }
      );
    }

    // Проверяем, есть ли уже день на эту дату
    const existingDay = await prisma.cashDay.findUnique({
      where: { date: new Date(body.date) }
    });

    if (existingDay) {
      return NextResponse.json(
        { error: 'Кассовый день на эту дату уже существует' },
        { status: 400 }
      );
    }

    // Создаем кассовый день (isClosed и total проставятся автоматически)
    const cashDay = await prisma.cashDay.create({
      data: {
        date: new Date(body.date)
      }
    });

    return NextResponse.json(cashDay, { status: 201 });
  } catch (error) {
    console.error('Error creating cash day:', error);
    return NextResponse.json(
      { error: 'Ошибка создания кассового дня' },
      { status: 500 }
    );
  }
}