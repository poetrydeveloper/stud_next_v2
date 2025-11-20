// app/api/product-units/[id]/status/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const unitId = Number(params.id);
    const body = await request.json();
    const { status, message } = body;

    if (!status) {
      return NextResponse.json(
        { ok: false, error: "Статус обязателен" },
        { status: 400 }
      );
    }

    // Обновляем статус productUnit
    const updatedUnit = await prisma.productUnit.update({
      where: { id: unitId },
      data: { statusCard: status },
    });

    // Создаём лог
    await prisma.productUnitLog.create({
      data: {
        productUnitId: unitId,
        type: "STATUS_CHANGE",
        message: message || `Статус изменён на ${status}`,
        meta: { newStatus: status },
      },
    });

    return NextResponse.json({ ok: true, data: updatedUnit });
  } catch (error: any) {
    console.error("POST /api/product-units/[id]/status error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
