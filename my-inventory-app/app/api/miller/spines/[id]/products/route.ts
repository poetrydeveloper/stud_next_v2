// app/api/miller/spines/[id]/products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET — Продукты spine со статистикой по units
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ← ДОБАВЬ AWAIT
    const spineId = parseInt(id);

    const products = await prisma.product.findMany({
      where: {
        spineId: spineId
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        productUnits: {
          select: {
            id: true,
            statusCard: true,
            statusProduct: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        code: "asc"
      }
    });

    // Агрегируем статистику по статусам
    const productsWithStats = products.map(product => {
      const statusCounts: Record<string, number> = {
        CLEAR: 0,
        CANDIDATE: 0,
        SPROUTED: 0,
        IN_REQUEST: 0,
        IN_DELIVERY: 0,
        ARRIVED: 0,
        IN_STORE: 0,
        SOLD: 0,
        CREDIT: 0,
        LOST: 0
      };

      product.productUnits.forEach(unit => {
        statusCounts[unit.statusCard]++;
        if (unit.statusProduct) {
          statusCounts[unit.statusProduct]++;
        }
      });

      return {
        id: product.id,
        code: product.code,
        name: product.name,
        description: product.description,
        brand: product.brand,
        productUnits: product.productUnits,
        _count: {
          productUnits: product.productUnits.length
        },
        statusCounts
      };
    });

    return NextResponse.json({
      ok: true,
      data: productsWithStats
    });

  } catch (error) {
    console.error("Ошибка при получении продуктов spine:", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось получить продукты" },
      { status: 500 }
    );
  }
}