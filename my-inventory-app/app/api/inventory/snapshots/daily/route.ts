// app/api/inventory/snapshots/daily/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST() {
  try {
    const snapshotDate = new Date();
    snapshotDate.setHours(0, 0, 0, 0);

    // УДАЛЯЕМ старые снимки за сегодня (если есть)
    await prisma.inventorySnapshot.deleteMany({
      where: {
        snapshotDate: {
          gte: new Date(snapshotDate),
          lt: new Date(snapshotDate.getTime() + 24 * 60 * 60 * 1000)
        },
        periodType: 'daily'
      }
    });

    // Получаем все продукты
    const products = await prisma.product.findMany({
      include: {
        productUnits: {
          where: {
            statusProduct: 'IN_STORE'
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

    const snapshots = [];
    let totalUnits = 0;
    let totalValue = 0;

    // Создаем снимки для каждого продукта (агрегированные)
    for (const product of products) {
      const unitsInStore = product.productUnits.length;
      
      if (unitsInStore > 0) {
        const averagePrice = await calculateAveragePrice(product.id);
        const productValue = unitsInStore * (averagePrice || 0);

        const snapshot = await prisma.inventorySnapshot.create({
          data: {
            snapshotDate,
            productUnitId: null, // Агрегированный снимок
            statusProduct: 'IN_STORE',
            salePrice: averagePrice,
            stockValue: productValue,
            periodType: 'daily'
          }
        });

        snapshots.push(snapshot);
        totalUnits += unitsInStore;
        totalValue += productValue;
      }
    }

    // Также создаем снимки для каждой отдельной единицы
    const allUnitsInStore = await prisma.productUnit.findMany({
      where: {
        statusProduct: 'IN_STORE'
      },
      include: {
        product: {
          select: {
            name: true,
            code: true
          }
        }
      }
    });

    for (const unit of allUnitsInStore) {
      const unitSnapshot = await prisma.inventorySnapshot.create({
        data: {
          snapshotDate,
          productUnitId: unit.id,
          statusProduct: unit.statusProduct,
          salePrice: unit.salePrice,
          stockValue: unit.salePrice || 0,
          periodType: 'daily'
        }
      });
      snapshots.push(unitSnapshot);
    }

    const result = {
      timestamp: new Date().toISOString(),
      snapshotDate: snapshotDate.toISOString(),
      summary: {
        totalProducts: products.length,
        productsWithStock: products.filter(p => p.productUnits.length > 0).length,
        totalUnits,
        totalValue
      },
      snapshotsCreated: snapshots.length
    };

    return NextResponse.json({
      ok: true,
      message: `Создано ${snapshots.length} снимков остатков`,
      data: result
    });

  } catch (error: any) {
    console.error("POST /api/inventory/snapshots/daily error:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

async function calculateAveragePrice(productId: number): Promise<number> {
  const units = await prisma.productUnit.findMany({
    where: { 
      productId,
      OR: [
        { salePrice: { not: null } },
        { requestPricePerUnit: { not: null } }
      ],
      statusProduct: 'IN_STORE'
    },
    select: { 
      salePrice: true,
      requestPricePerUnit: true 
    }
  });

  if (units.length === 0) return 0;

  const prices = units.map(unit => {
    return unit.salePrice || unit.requestPricePerUnit || 0;
  }).filter(price => price > 0);

  if (prices.length === 0) return 0;
  
  return prices.reduce((sum, price) => sum + price, 0) / prices.length;
}