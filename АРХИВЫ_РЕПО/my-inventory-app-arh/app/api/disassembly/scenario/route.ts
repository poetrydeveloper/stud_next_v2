// app/api/disassembly/scenario/route.ts (ПЕРЕПИСАННЫЙ - новая логика)
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { DisassemblyService } from "@/app/lib/disassemblyService";

/**
 * POST /api/disassembly/scenario
 * Создание сценария разборки (новая логика)
 * body: { name: string, parentProductCode: string, childProductCodes: string[] }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, parentProductCode, childProductCodes } = body;

    console.log("🔍 POST /api/disassembly/scenario:", { name, parentProductCode, childProductCodes });

    // Валидация
    if (!name || !parentProductCode || !childProductCodes) {
      return NextResponse.json(
        { ok: false, error: "Все поля обязательны: name, parentProductCode, childProductCodes" },
        { status: 400 }
      );
    }

    if (!Array.isArray(childProductCodes) || childProductCodes.length === 0) {
      return NextResponse.json(
        { ok: false, error: "childProductCodes должен быть непустым массивом" },
        { status: 400 }
      );
    }

    // Создание сценария
    const scenario = await DisassemblyService.createScenario({
      name,
      parentProductCode,
      childProductCodes
    });

    console.log("✅ POST /api/disassembly/scenario успешно:", {
      scenarioId: scenario.id,
      parentProductCode: scenario.parentProductCode,
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

/**
 * GET /api/disassembly/scenario
 * Получение сценариев с фильтрацией
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productCode = searchParams.get('productCode');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    console.log("🔍 GET /api/disassembly/scenario:", { productCode, includeInactive });

    let scenarios;
    
    if (productCode) {
      // Сценарии для конкретного продукта
      scenarios = await DisassemblyService.getScenariosByProductCode(productCode);
    } else {
      // Все сценарии
      scenarios = await DisassemblyService.getAllScenarios(includeInactive);
    }

    console.log("✅ GET /api/disassembly/scenario успешно:", {
      scenariosCount: scenarios.length,
      productCode,
      includeInactive
    });

    return NextResponse.json({ ok: true, data: scenarios });
  } catch (err: any) {
    console.error("❌ GET /api/disassembly/scenario ошибка:", err);
    
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}