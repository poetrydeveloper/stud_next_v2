// app/api/disassembly/assemble/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { DisassemblyService } from "@/app/lib/disassemblyService";

/**
 * POST /api/disassembly/assemble
 * Выполнение сборки
 * body: { parentUnitId: number, childUnitIds: number[] }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parentUnitId, childUnitIds } = body;

    console.log("🔍 POST /api/disassembly/assemble:", { parentUnitId, childUnitIds });

    // Валидация
    if (!parentUnitId || !childUnitIds) {
      return NextResponse.json(
        { ok: false, error: "parentUnitId и childUnitIds обязательны" },
        { status: 400 }
      );
    }

    if (!Array.isArray(childUnitIds) || childUnitIds.length === 0) {
      return NextResponse.json(
        { ok: false, error: "childUnitIds должен быть непустым массивом" },
        { status: 400 }
      );
    }

    // Выполнение сборки
    const result = await DisassemblyService.executeAssembly({
      parentUnitId,
      childUnitIds
    });

    console.log("✅ POST /api/disassembly/assemble успешно:", {
      parentUnitId: result.parentUnit.id,
      childUnitsCount: result.childUnits.length
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (err: any) {
    console.error("❌ POST /api/disassembly/assemble ошибка:", err);
    
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 400 }
    );
  }
}