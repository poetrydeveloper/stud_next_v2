// app/api/disassembly/scenario/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { DisassemblyService } from "@/app/lib/disassemblyService";

/**
 * POST /api/disassembly/scenario
 * Создание сценария разборки
 * body: { name: string, parentUnitId: number, childProductsIds: number[] }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, parentUnitId, childProductsIds } = body;

    console.log("🔍 POST /api/disassembly/scenario:", { name, parentUnitId, childProductsIds });

    // Валидация
    if (!name || !parentUnitId || !childProductsIds) {
      return NextResponse.json(
        { ok: false, error: "Все поля обязательны: name, parentUnitId, childProductsIds" },
        { status: 400 }
      );
    }

    if (!Array.isArray(childProductsIds) || childProductsIds.length === 0) {
      return NextResponse.json(
        { ok: false, error: "childProductsIds должен быть непустым массивом" },
        { status: 400 }
      );
    }

    // Создание сценария
    const scenario = await DisassemblyService.createScenario({
      name,
      parentUnitId,
      childProductsIds
    });

    console.log("✅ POST /api/disassembly/scenario успешно:", {
      scenarioId: scenario.id,
      parentUnitId: scenario.parentUnitId,
      partsCount: scenario.partsCount
    });

    return NextResponse.json({ ok: true, data: scenario });
  } catch (err: any) {
    console.error("❌ POST /api/disassembly/scenario ошибка:", err);
    
    // Определяем статус код по типу ошибки
    const status = err.message.includes('не найден') ? 404 : 
                   err.message.includes('уже существует') ? 409 : 400;
    
    return NextResponse.json(
      { ok: false, error: err.message },
      { status }
    );
  }
}