// app/api/disassembly/unit/[unitId]/scenarios/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { DisassemblyService } from "@/app/lib/disassemblyService";

/**
 * GET /api/disassembly/unit/[unitId]/scenarios
 * Получение сценариев по unitId
 */
export async function GET(
  req: Request,
  { params }: { params: { unitId: string } }
) {
  try {
    const unitId = Number(params.unitId);

    console.log("🔍 GET /api/disassembly/unit/[unitId]/scenarios:", { unitId });

    if (isNaN(unitId)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный ID unit" },
        { status: 400 }
      );
    }

    const scenarios = await DisassemblyService.getUnitScenarios(unitId);

    console.log("✅ GET /api/disassembly/unit/[unitId]/scenarios успешно:", {
      unitId,
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