// app/api/inventory/movement/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // 1. Получаем логи изменений статусов из ProductUnitLog
    const statusChanges = await prisma.productUnitLog.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        type: 'STATUS_CHANGE'
      },
      include: {
        productUnit: {
          include: {
            product: {
              select: {
                name: true,
                code: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 2. Получаем продажи из CashEvent
    const sales = await prisma.cashEvent.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        type: 'SALE'
      },
      include: {
        productUnit: {
          include: {
            product: {
              select: {
                name: true,
                code: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 3. Группируем по дням
    const dailyMovement: any = {};
    
    // Обрабатываем изменения статусов
    statusChanges.forEach(log => {
      const date = log.createdAt.toISOString().split('T')[0];
      if (!dailyMovement[date]) {
        dailyMovement[date] = {
          date,
          arrivals: 0,    // Поступления
          sales: 0,       // Продажи
          returns: 0,     // Возвраты
          details: []
        };
      }
      
      // Анализируем сообщение лога для определения типа движения
      if (log.message.includes('IN_STORE')) {
        dailyMovement[date].arrivals += 1;
      } else if (log.message.includes('SOLD')) {
        dailyMovement[date].sales += 1;
      } else if (log.message.includes('RETURN')) {
        dailyMovement[date].returns += 1;
      }
      
      dailyMovement[date].details.push({
        type: 'STATUS_CHANGE',
        product: log.productUnit.product?.name,
        message: log.message,
        timestamp: log.createdAt
      });
    });

    // Обрабатываем продажи из CashEvent
    sales.forEach(sale => {
      const date = sale.createdAt.toISOString().split('T')[0];
      if (!dailyMovement[date]) {
        dailyMovement[date] = {
          date,
          arrivals: 0,
          sales: 0,
          returns: 0,
          details: []
        };
      }
      
      dailyMovement[date].sales += 1;
      dailyMovement[date].details.push({
        type: 'SALE',
        product: sale.productUnit?.product?.name,
        amount: sale.amount,
        timestamp: sale.createdAt
      });
    });

    const result = {
      period: {
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
        days: days
      },
      summary: {
        totalArrivals: Object.values(dailyMovement).reduce((sum: number, day: any) => sum + day.arrivals, 0),
        totalSales: Object.values(dailyMovement).reduce((sum: number, day: any) => sum + day.sales, 0),
        totalReturns: Object.values(dailyMovement).reduce((sum: number, day: any) => sum + day.returns, 0)
      },
      dailyMovement: Object.values(dailyMovement).sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    };

    return NextResponse.json({
      ok: true,
      data: result
    });

  } catch (error: any) {
    console.error("GET /api/inventory/movement error:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}