// app/api/inventory/current/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    // Получаем все юниты со статусом IN_STORE
    const unitsInStore = await prisma.productUnit.findMany({
      where: {
        statusProduct: 'IN_STORE'
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            code: true,
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
      },
      orderBy: {
        product: {
          name: 'asc'
        }
      }
    });

    // Группируем по продуктам
    const productsMap = new Map();

    unitsInStore.forEach(unit => {
      const productId = unit.product.id;
      
      if (!productsMap.has(productId)) {
        productsMap.set(productId, {
          productId: productId,
          productName: unit.product.name,
          productCode: unit.product.code,
          category: unit.product.category?.name,
          brand: unit.product.brand?.name,
          unitsInStore: 0,
          totalValue: 0,
          units: []
        });
      }

      const productData = productsMap.get(productId);
      const unitValue = unit.salePrice || 0;

      productData.unitsInStore += 1;
      productData.totalValue += unitValue;
      productData.units.push({
        id: unit.id,
        serialNumber: unit.serialNumber,
        statusProduct: unit.statusProduct,
        salePrice: unit.salePrice,
        createdAt: unit.createdAt
      });
    });

    const result = {
      timestamp: new Date().toISOString(),
      totalUnits: unitsInStore.length,
      totalProducts: productsMap.size,
      products: Array.from(productsMap.values())
    };

    return NextResponse.json({
      ok: true,
      data: result
    });

  } catch (error: any) {
    console.error("GET /api/inventory/current error:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}