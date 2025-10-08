// app/api/product-units/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitCardStatus } from "@prisma/client";
import { recalcProductUnitStats } from "./helpers";

/**
 * GET /api/product-units?productId=
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");

  console.log("🔍 GET /api/product-units:", { productId });

  const where: any = {};
  if (productId) where.productId = Number(productId);

  try {
    const units = await prisma.productUnit.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { 
        product: { 
          include: { 
            category: true, 
            brand: true, 
            spine: true,
            images: true 
          } 
        },
        spine: { include: { category: true } },
        supplier: true,
        customer: true,
        // 🔥 ВАЖНО: ВКЛЮЧАЕМ ЛОГИ С СОРТИРОВКОЙ
        logs: {
          orderBy: { createdAt: 'desc' }
        },
      },
    });

    console.log("✅ GET /api/product-units успешно:", {
      unitsCount: units.length,
      firstUnit: units[0] ? {
        id: units[0].id,
        serialNumber: units[0].serialNumber,
        logsCount: units[0].logs?.length || 0
      } : 'no units'
    });

    return NextResponse.json({ ok: true, data: units });
  } catch (error) {
    console.error("❌ GET /api/product-units ошибка:", error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
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

    console.log("🔍 PATCH /api/product-units:", { unitId, quantity });

    if (!unitId) {
      return NextResponse.json({ ok: false, error: "unitId required" }, { status: 400 });
    }

    const unit = await prisma.productUnit.findUnique({
      where: { id: unitId },
      include: { logs: true },
    });

    if (!unit) {
      return NextResponse.json({ ok: false, error: "ProductUnit not found" }, { status: 404 });
    }

    const updatedUnit = await prisma.productUnit.update({
      where: { id: unitId },
      data: {
        statusCard: ProductUnitCardStatus.CANDIDATE,
        quantityInCandidate: quantity,
        createdAtCandidate: new Date(),
        logs: {
          create: {
            type: "SYSTEM",
            message: `Unit добавлен в кандидаты (${quantity} шт.)`,
            meta: { event: "ADDED_TO_CANDIDATE", quantity },
          },
        },
      },
      include: { 
        logs: {
          orderBy: { createdAt: 'desc' }
        } 
      },
    });

    console.log("✅ PATCH /api/product-units успешно:", {
      unitId: updatedUnit.id,
      newStatus: updatedUnit.statusCard,
      logsCount: updatedUnit.logs.length
    });

    await recalcProductUnitStats(unit.productId);

    return NextResponse.json({ ok: true, data: updatedUnit });
  } catch (err: any) {
    console.error("❌ PATCH /api/product-units error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}