// app/api/disassembly/unit/[unitId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { unitId: string } }
) {
  try {
    const unitId = Number(params.unitId);

    if (isNaN(unitId)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный ID unit" },
        { status: 400 }
      );
    }

    const unit = await prisma.productUnit.findUnique({
      where: { id: unitId },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            spine: true,
            images: {
              where: { isMain: true },
              take: 1
            }
          }
        },
        spine: true,
        supplier: true
      }
    });

    if (!unit) {
      return NextResponse.json(
        { ok: false, error: "Unit не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: unit });
  } catch (err: any) {
    console.error("❌ GET /api/disassembly/unit/[unitId] ошибка:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}