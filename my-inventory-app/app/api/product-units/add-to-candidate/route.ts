// app/api/product-units/add-to-candidate/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitCardStatus } from "@prisma/client";
import { appendLog, recalcProductUnitStats } from "@/app/api/product-units/helpers";

export async function PATCH(req: Request) {
  try {
    // Берём unitId и quantity из body запроса
    const { unitId, quantity = 1 } = await req.json();

    if (!unitId) {
      return NextResponse.json({ ok: false, error: "unitId required" }, { status: 400 });
    }

    // Находим единицу
    const unit = await prisma.productUnit.findUnique({ where: { id: unitId } });
    if (!unit) {
      return NextResponse.json({ ok: false, error: "ProductUnit not found" }, { status: 404 });
    }

    // Обновляем статус и количество кандидата
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

    // Пересчёт статистики продукта
    await recalcProductUnitStats(unit.productId);

    return NextResponse.json({ ok: true, data: updatedUnit });
  } catch (err: any) {
    console.error("PATCH /api/product-units/add-to-candidate error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
