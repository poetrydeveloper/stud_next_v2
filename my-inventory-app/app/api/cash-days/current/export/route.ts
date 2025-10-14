// app/api/cash-days/current/export/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    // Получаем текущий кассовый день
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log("🔍 Поиск кассового дня для даты:", today);

    const cashDay = await prisma.cashDay.findFirst({
      where: {
        date: { gte: today },
        isClosed: false
      },
      include: {
        events: {
          where: { type: 'SALE' },
          include: {
            productUnit: {
              include: {
                product: true,
                supplier: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    console.log("📊 Найден кассовый день:", {
      found: !!cashDay,
      eventsCount: cashDay?.events.length || 0,
      events: cashDay?.events.map(e => ({
        id: e.id,
        type: e.type,
        amount: e.amount,
        productUnit: e.productUnit ? {
          productCode: e.productUnit.productCode,
          productName: e.productUnit.productName,
          product: e.productUnit.product
        } : null
      }))
    });

    if (!cashDay) {
      return NextResponse.json(
        { ok: false, error: "Активный кассовый день не найден" },
        { status: 404 }
      );
    }

    // Формируем данные для экспорта
    const exportData = cashDay.events.map((event, index) => {
      const unit = event.productUnit;
      const product = unit?.product;
      
      return {
        номер: index + 1,
        дата: new Date(event.createdAt).toLocaleDateString('ru-RU'),
        код: unit?.productCode || product?.code || 'БЕЗ_КОДА',
        наименование: unit?.productName || product?.name || 'Неизвестный товар',
        цена: event.amount,
        количество: 1,
        сумма: event.amount,
        поставщик: unit?.supplier?.name || '',
        примечание: event.notes
      };
    });

    console.log("📋 Сформированные данные для экспорта:", exportData);

    return NextResponse.json({
      ok: true,
      data: {
        cashDay: {
          date: cashDay.date,
          total: cashDay.total,
          eventsCount: cashDay.events.length
        },
        sales: exportData
      }
    });

  } catch (error: any) {
    console.error("❌ Export error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}