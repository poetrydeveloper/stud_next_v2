// app/api/disassembly/execute/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { DisassemblyService } from "@/app/lib/disassemblyService";

/**
 * POST /api/disassembly/execute
 * Выполнение разборки по сценарию
 * body: { scenarioId: number }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scenarioId } = body;

    console.log("🔍 POST /api/disassembly/execute:", { scenarioId });

    // Валидация
    if (!scenarioId) {
      return NextResponse.json(
        { ok: false, error: "scenarioId обязателен" },
        { status: 400 }
      );
    }

    // Выполнение разборки
    const result = await DisassemblyService.executeDisassembly({
      scenarioId
    });

    console.log("✅ POST /api/disassembly/execute успешно:", {
      scenarioId: result.scenario.id,
      parentUnitId: result.parentUnit.id,
      childUnitsCount: result.childUnits.length
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (err: any) {
    console.error("❌ POST /api/disassembly/execute ошибка:", err);
    
    // Определяем статус код по типу ошибки
    const status = err.message.includes('не найден') ? 404 : 400;
    
    return NextResponse.json(
      { ok: false, error: err.message },
      { status }
    );
  }
}