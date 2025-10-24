// app/api/inventory/visual/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    // Получаем все товары с остатками и продажами за неделю
    const products = await prisma.product.findMany({
      include: {
        productUnits: {
          where: {
            OR: [
              { statusProduct: 'IN_STORE' },
              { 
                statusProduct: 'SOLD',
                soldAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
              }
            ]
          }
        },
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
    });

    // Анализируем каждый товар
    const analyzedProducts = products.map(product => {
      const unitsInStore = product.productUnits.filter(unit => unit.statusProduct === 'IN_STORE').length;
      const salesLastWeek = product.productUnits.filter(unit => 
        unit.statusProduct === 'SOLD' && unit.soldAt
      ).length;

      // Определяем цвет фона (остатки)
      let bgColor = 'bg-green-100'; // Много
      if (unitsInStore <= 5 && unitsInStore > 1) bgColor = 'bg-yellow-100'; // Мало
      if (unitsInStore === 1) bgColor = 'bg-red-100'; // Критично
      if (unitsInStore === 0) bgColor = 'bg-gray-100'; // Нет в наличии

      // Определяем цвет бордера (продажи)
      let borderColor = 'border-gray-300'; // Низкие продажи
      if (salesLastWeek >= 2 && salesLastWeek <= 3) borderColor = 'border-yellow-400'; // Средние
      if (salesLastWeek >= 4) borderColor = 'border-red-400'; // Высокие

      // Генерируем рекомендацию
      const recommendation = generateRecommendation(unitsInStore, salesLastWeek);

      return {
        id: product.id,
        name: product.name,
        code: product.code,
        category: product.category?.name,
        brand: product.brand?.name,
        unitsInStore,
        salesLastWeek,
        bgColor,
        borderColor,
        recommendation,
        // Для CSS классов
        bgClass: bgColor,
        borderClass: `${borderColor} border-2`,
        status: {
          stock: unitsInStore <= 1 ? 'critical' : unitsInStore <= 5 ? 'warning' : 'good',
          sales: salesLastWeek >= 4 ? 'high' : salesLastWeek >= 2 ? 'medium' : 'low'
        }
      };
    });

    // Сортируем: сначала критические, потом по продажам
    const sortedProducts = analyzedProducts.sort((a, b) => {
      // Сначала по критичности остатков
      if (a.unitsInStore === 1 && b.unitsInStore > 1) return -1;
      if (b.unitsInStore === 1 && a.unitsInStore > 1) return 1;
      
      // Потом по количеству остатков
      if (a.unitsInStore !== b.unitsInStore) return a.unitsInStore - b.unitsInStore;
      
      // Потом по продажам (высокие сначала)
      return b.salesLastWeek - a.salesLastWeek;
    });

    return NextResponse.json({
      ok: true,
      data: {
        products: sortedProducts,
        summary: {
          total: sortedProducts.length,
          critical: sortedProducts.filter(p => p.unitsInStore === 1).length,
          warning: sortedProducts.filter(p => p.unitsInStore > 1 && p.unitsInStore <= 5).length,
          good: sortedProducts.filter(p => p.unitsInStore > 5).length,
          highSales: sortedProducts.filter(p => p.salesLastWeek >= 4).length
        }
      }
    });

  } catch (error: any) {
    console.error("GET /api/inventory/visual error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// Генерация рекомендаций
function generateRecommendation(unitsInStore: number, salesLastWeek: number): string {
  if (unitsInStore === 0) return '❌ Нет в наличии - срочный заказ';
  if (unitsInStore === 1 && salesLastWeek >= 2) return '🚨 Критично! Заказать немедленно';
  if (unitsInStore === 1) return '⚠️ Остался 1 шт - рекомендуется заказ';
  if (unitsInStore <= 3 && salesLastWeek >= 3) return '📦 Мало остатков при высоком спросе - заказать';
  if (unitsInStore <= 5 && salesLastWeek >= 2) return '📈 Популярный товар - пополнить запасы';
  if (unitsInStore <= 5) return '👀 Следить за остатками';
  if (salesLastWeek >= 4) return '🔥 Хорошо продается - поддерживать запас';
  
  return '✅ Стабильно';
}