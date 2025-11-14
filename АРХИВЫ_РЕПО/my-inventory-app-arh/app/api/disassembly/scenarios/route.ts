// app/api/disassembly/scenarios/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET /api/disassembly/scenarios
 * Получение всех сценариев
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    console.log("🔍 GET /api/disassembly/scenarios");

    const scenarios = await prisma.disassemblyScenario.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        parentUnit: {
          include: {
            product: true,
            spine: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log("✅ GET /api/disassembly/scenarios успешно:", {
      scenariosCount: scenarios.length,
      includeInactive
    });

    return NextResponse.json({ ok: true, data: scenarios });
  } catch (err: any) {
    console.error("❌ GET /api/disassembly/scenarios ошибка:", err);
    
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}