// app/api/disassembly/unit/[unitId]/scenarios/route.ts (ИСПРАВЛЕННЫЙ)
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { DisassemblyService } from "@/app/lib/disassemblyService";

/**
 * GET /api/disassembly/unit/[unitId]/scenarios
 * Получение доступных сценариев для unit (новая логика)
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ unitId: string }> } // ← ДОБАВЛЕНО Promise
) {
  try {
    const { unitId } = await params; // ← ДОБАВЛЕН await
    const unitIdNumber = Number(unitId);

    console.log("🔍 GET /api/disassembly/unit/[unitId]/scenarios:", { unitId: unitIdNumber });

    if (isNaN(unitIdNumber)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный ID unit" },
        { status: 400 }
      );
    }

    const scenarios = await DisassemblyService.getUnitScenarios(unitIdNumber);

    console.log("✅ GET /api/disassembly/unit/[unitId]/scenarios успешно:", {
      unitId: unitIdNumber,
      scenariosCount: scenarios.length
    });

    return NextResponse.json({ ok: true, data: scenarios });
  } catch (err: any) {
    console.error("❌ GET /api/disassembly/unit/[unitId]/scenarios ошибка:", err);
    
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}