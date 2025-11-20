import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Упрощенный endpoint без внешних зависимостей
export async function GET() {
  try {
    // Находим сегодняшний день
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ищем открытый кассовый день на сегодня
    const cashDay = await prisma.cashDay.findFirst({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // +1 день
        },
        isClosed: false
      }
    });

    // Если нет открытого дня, создаем его
    let currentCashDay = cashDay;
    if (!currentCashDay) {
      currentCashDay = await prisma.cashDay.create({
        data: {
          date: today,
          isClosed: false,
          total: 0
        }
      });
    }

    return NextResponse.json({ 
      ok: true, 
      data: currentCashDay 
    });
  } catch (error: any) {
    console.error("GET /api/cash-days/current error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}