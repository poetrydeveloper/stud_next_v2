// app/api/disassembly/scenario/validate/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { DisassemblyService } from "@/app/lib/disassemblyService";

/**
 * GET /api/disassembly/scenario/validate/[id]
 * Валидация сценария
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    console.log("🔍 GET /api/disassembly/scenario/validate/[id]:", { id });

    if (isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный ID сценария" },
        { status: 400 }
      );
    }

    const validation = await DisassemblyService.validateScenario(id);

    console.log("✅ GET /api/disassembly/scenario/validate/[id] успешно:", {
      scenarioId: id,
      isValid: validation.isValid,
      canExecute: validation.canExecute
    });

    return NextResponse.json({ ok: true, data: validation });
  } catch (err: any) {
    console.error("❌ GET /api/disassembly/scenario/validate/[id] ошибка:", err);
    
    const status = err.message.includes('не найден') ? 404 : 500;
    
    return NextResponse.json(
      { ok: false, error: err.message },
      { status }
    );
  }
}