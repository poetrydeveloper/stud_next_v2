// app/api/product-units/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitCardStatus } from "@prisma/client";
import { recalcProductUnitStats, appendLog } from "./helpers";

/**
 * GET /api/product-units?productId=
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");

  const where: any = {};
  if (productId) where.productId = Number(productId);

  // app/api/product-units/route.ts
const units = await prisma.productUnit.findMany({
  where,
  orderBy: { createdAt: "desc" },
  take: 200,
  include: { 
    product: {
      include: {
        category: true,  // категория продукта
        brand: true,     // бренд продукта
        spine: true      // spine продукта (на всякий случай)
      }
    },
    spine: {             // ← ОСНОВНАЯ связь! Именно эта должна работать
      include: {
        category: true   // если нужна категория spine
      }
    },
    supplier: true,
    customer: true
  },
});

  return NextResponse.json({ ok: true, data: units });
}

/**
 * PATCH /api/product-units
 * Добавить единицу в кандидаты
 * body: { unitId, quantity? }
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { unitId, quantity = 1 } = body;

    if (!unitId) {
      return NextResponse.json({ ok: false, error: "unitId required" }, { status: 400 });
    }

    const unit = await prisma.productUnit.findUnique({ where: { id: unitId } });
    if (!unit) {
      return NextResponse.json({ ok: false, error: "ProductUnit not found" }, { status: 404 });
    }

    const updatedUnit = await prisma.productUnit.update({
      where: { id: unitId },
      data: {
        statusCard: ProductUnitCardStatus.CANDIDATE,
        quantityInCandidate: quantity,
        createdAtCandidate: new Date(),
        logs: appendLog(unit.logs || [], {
          event: "ADDED_TO_CANDIDATE",
          at: new Date().toISOString(),
          quantity,
          parentId: unit.parentProductUnitId ?? null,
        }),
      },
    });

    await recalcProductUnitStats(unit.productId);
    return NextResponse.json({ ok: true, data: updatedUnit });
  } catch (err: any) {
    console.error("PATCH /api/product-units error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
