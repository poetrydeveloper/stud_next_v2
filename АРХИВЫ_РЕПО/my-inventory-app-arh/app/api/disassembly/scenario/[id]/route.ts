//app/api/disassembly/scenario/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// GET /api/disassembly/scenario/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scenarioId = Number(id);

    console.log("🔍 GET /api/disassembly/scenario/[id]:", { scenarioId });

    if (isNaN(scenarioId)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный ID сценария" },
        { status: 400 }
      );
    }

    const scenario = await prisma.disassemblyScenario.findUnique({
      where: { id: scenarioId }
    });

    if (!scenario) {
      return NextResponse.json(
        { ok: false, error: "Сценарий не найден" },
        { status: 404 }
      );
    }

    console.log("✅ GET /api/disassembly/scenario/[id] успешно:", {
      scenarioId: scenario.id,
      name: scenario.name
    });

    return NextResponse.json({ ok: true, data: scenario });
  } catch (err: any) {
    console.error("❌ GET /api/disassembly/scenario/[id] ошибка:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

// PATCH /api/disassembly/scenario/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scenarioId = Number(id);
    const body = await request.json();
    const { isActive } = body;

    console.log("🔍 PATCH /api/disassembly/scenario/[id]:", { scenarioId, isActive });

    if (isNaN(scenarioId)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный ID сценария" },
        { status: 400 }
      );
    }

    const updatedScenario = await prisma.disassemblyScenario.update({
      where: { id: scenarioId },
      data: { isActive }
    });

    console.log("✅ PATCH /api/disassembly/scenario/[id] успешно:", {
      scenarioId: updatedScenario.id,
      isActive: updatedScenario.isActive
    });

    return NextResponse.json({ ok: true, data: updatedScenario });
  } catch (err: any) {
    console.error("❌ PATCH /api/disassembly/scenario/[id] ошибка:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}