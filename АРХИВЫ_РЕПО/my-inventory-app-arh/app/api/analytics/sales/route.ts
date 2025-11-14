// app/api/analytics/sales/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week'; // week, month, quarter
    const productId = searchParams.get('productId');
    const category = searchParams.get('category');

    // Определяем период
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Условия для фильтрации
    const whereClause: any = {
      type: 'SALE',
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    };

    // Добавляем фильтры если есть
    if (productId || category) {
      whereClause.productUnit = {
        product: {}
      };
      
      if (productId) {
        whereClause.productUnit.product.id = parseInt(productId);
      }
      
      if (category) {
        whereClause.productUnit.product.category = {
          name: {
            contains: category,
            mode: 'insensitive'
          }
        };
      }
    }

    // Получаем данные о продажах
    const salesData = await prisma.cashEvent.findMany({
      where: whereClause,
      include: {
        productUnit: {
          include: {
            product: {
              include: {
                category: {
                  select: {
                    name: true
                  }
                },
                brand: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Анализируем данные
    const analysis = analyzeSalesData(salesData, period);

    return NextResponse.json({
      ok: true,
      data: {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          type: period
        },
        summary: analysis.summary,
        topProducts: analysis.topProducts,
        categoryBreakdown: analysis.categoryBreakdown,
        brandBreakdown: analysis.brandBreakdown,
        dailyTrend: analysis.dailyTrend,
        hourlyTrend: analysis.hourlyTrend
      }
    });

  } catch (error: any) {
    console.error("GET /api/analytics/sales error:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Функция для анализа данных продаж
function analyzeSalesData(salesData: any[], period: string) {
  // Основные метрики
  const summary = {
    totalSales: salesData.length,
    totalRevenue: salesData.reduce((sum, sale) => sum + sale.amount, 0),
    averageSale: 0,
    bestSellingDay: '',
    bestSellingHour: ''
  };
  summary.averageSale = summary.totalRevenue / (summary.totalSales || 1);

  // Топ продуктов по выручке
  const productMap = new Map();
  salesData.forEach(sale => {
    const productId = sale.productUnit?.product?.id;
    if (!productId) return;

    if (!productMap.has(productId)) {
      productMap.set(productId, {
        productId,
        productName: sale.productUnit.product.name,
        productCode: sale.productUnit.product.code,
        salesCount: 0,
        totalRevenue: 0,
        averagePrice: 0
      });
    }

    const product = productMap.get(productId);
    product.salesCount += 1;
    product.totalRevenue += sale.amount;
    product.averagePrice = product.totalRevenue / product.salesCount;
  });

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 15);

  // Распределение по категориям
  const categoryMap = new Map();
  salesData.forEach(sale => {
    const category = sale.productUnit?.product?.category?.name || 'Без категории';
    
    if (!categoryMap.has(category)) {
      categoryMap.set(category, {
        category,
        salesCount: 0,
        totalRevenue: 0,
        percentage: 0
      });
    }

    const cat = categoryMap.get(category);
    cat.salesCount += 1;
    cat.totalRevenue += sale.amount;
  });

  // Расчет процентов
  const categoryBreakdown = Array.from(categoryMap.values())
    .map(cat => ({
      ...cat,
      percentage: (cat.totalRevenue / summary.totalRevenue) * 100
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Распределение по брендам
  const brandMap = new Map();
  salesData.forEach(sale => {
    const brand = sale.productUnit?.product?.brand?.name || 'Без бренда';
    
    if (!brandMap.has(brand)) {
      brandMap.set(brand, {
        brand,
        salesCount: 0,
        totalRevenue: 0
      });
    }

    const brandData = brandMap.get(brand);
    brandData.salesCount += 1;
    brandData.totalRevenue += sale.amount;
  });

  const brandBreakdown = Array.from(brandMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  // Тренд по дням
  const dailyMap = new Map();
  let bestDay = { date: '', revenue: 0 };
  
  salesData.forEach(sale => {
    const date = sale.createdAt.toISOString().split('T')[0];
    
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        salesCount: 0,
        totalRevenue: 0,
        dayName: new Date(date).toLocaleDateString('ru-RU', { weekday: 'long' })
      });
    }

    const day = dailyMap.get(date);
    day.salesCount += 1;
    day.totalRevenue += sale.amount;

    // Определяем лучший день
    if (day.totalRevenue > bestDay.revenue) {
      bestDay = { date: day.dayName, revenue: day.totalRevenue };
    }
  });

  summary.bestSellingDay = bestDay.date;

  const dailyTrend = Array.from(dailyMap.values())
    .sort((a, b) => a.date.localeCompare(b.date));

  // Тренд по часам
  const hourlyMap = new Map();
  let bestHour = { hour: '', revenue: 0 };

  for (let i = 0; i < 24; i++) {
    hourlyMap.set(i, {
      hour: i,
      hourLabel: `${i}:00`,
      salesCount: 0,
      totalRevenue: 0
    });
  }

  salesData.forEach(sale => {
    const hour = new Date(sale.createdAt).getHours();
    const hourData = hourlyMap.get(hour);
    hourData.salesCount += 1;
    hourData.totalRevenue += sale.amount;

    if (hourData.totalRevenue > bestHour.revenue) {
      bestHour = { hour: hourData.hourLabel, revenue: hourData.totalRevenue };
    }
  });

  summary.bestSellingHour = bestHour.hour;

  const hourlyTrend = Array.from(hourlyMap.values())
    .filter(hour => hour.salesCount > 0)
    .sort((a, b) => a.hour - b.hour);

  return {
    summary,
    topProducts,
    categoryBreakdown,
    brandBreakdown,
    dailyTrend,
    hourlyTrend
  };
}