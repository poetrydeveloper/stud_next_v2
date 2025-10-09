// app/api/disassembly/scenario/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { DisassemblyService } from "@/app/lib/disassemblyService";

/**
 * GET /api/disassembly/scenario/[id]
 * Получение сценария по ID
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    console.log("🔍 GET /api/disassembly/scenario/[id]:", { id });

    if (isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный ID сценария" },
        { status: 400 }
      );
    }

    const scenario = await DisassemblyService.getScenario(id);

    if (!scenario) {
      return NextResponse.json(
        { ok: false, error: "Сценарий не найден" },
        { status: 404 }
      );
    }

    console.log("✅ GET /api/disassembly/scenario/[id] успешно:", {
      scenarioId: scenario.id,
      parentUnitId: scenario.parentUnitId
    });

    return NextResponse.json({ ok: true, data: scenario });
  } catch (err: any) {
    console.error("❌ GET /api/disassembly/scenario/[id] ошибка:", err);
    
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}