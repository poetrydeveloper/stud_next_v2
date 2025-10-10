// app/api/disassembly/scenario/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// GET /api/disassembly/scenario/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const scenarioId = Number((await params).id);

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

    return NextResponse.json({ ok: true, data: scenario });
  } catch (err: any) {
    console.error("❌ GET /api/disassembly/scenario/[id] ошибка:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/disassembly/scenario/[id]
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const scenarioId = Number(params.id);
    const body = await req.json();
    const { isActive } = body;

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

    return NextResponse.json({ ok: true, data: updatedScenario });
  } catch (err: any) {
    console.error("❌ PATCH /api/disassembly/scenario/[id] ошибка:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}