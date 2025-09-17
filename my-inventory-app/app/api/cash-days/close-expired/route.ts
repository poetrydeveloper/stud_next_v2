// app/api/cash-days/close-expired/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    // Находим все открытые кассовые дни старше сегодняшнего дня
    const expiredCashDays = await prisma.cashDay.findMany({
      where: {
        isClosed: false,
        date: {
          lt: new Date(new Date().setHours(0, 0, 0, 0)) // Все дни до сегодняшнего
        }
      },
      include: {
        events: true
      }
    });

    let closedCount = 0;

    for (const cashDay of expiredCashDays) {
      await prisma.cashDay.update({
        where: { id: cashDay.id },
        data: { isClosed: true }
      });
      closedCount++;
    }

    return NextResponse.json({
      message: `Автоматически закрыто ${closedCount} кассовых дней`,
      closedDays: closedCount
    });

  } catch (error) {
    console.error('Error closing expired cash days:', error);
    return NextResponse.json(
      { error: 'Ошибка автоматического закрытия кассовых дней' },
      { status: 500 }
    );
  }
}