//app/api/disassembly/unit/[unitId]/children/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;
    
    console.log("🔍 GET /api/disassembly/unit/[unitId]/children:", { unitId });

    // Проверяем что parent unit существует и разобран
    const parentUnit = await prisma.productUnit.findUnique({
      where: { id: parseInt(unitId) },
      select: {
        id: true,
        statusProduct: true,
        disassemblyStatus: true
      }
    });

    if (!parentUnit) {
      return NextResponse.json(
        { ok: false, error: "Родительский unit не найден" },
        { status: 404 }
      );
    }

    if (parentUnit.statusProduct !== "IN_DISASSEMBLED") {
      return NextResponse.json(
        { ok: false, error: "Родительский unit не разобран" },
        { status: 400 }
      );
    }

    // Находим всех дочерних units для этого родителя
    const children = await prisma.productUnit.findMany({
      where: {
        disassembledParentId: parseInt(unitId),
        statusProduct: 'IN_STORE', // Только доступные для сборки
        disassemblyStatus: {
          in: ['PARTIAL', 'MONOLITH'] // ← ИСПРАВЛЕНО: добавили MONOLITH
        }
      },
      select: {
        id: true,
        serialNumber: true,
        statusProduct: true,
        disassemblyStatus: true,
        productName: true,
        productCode: true,
        product: {
          select: {
            name: true,
            code: true
          }
        },
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log("✅ GET /api/disassembly/unit/[unitId]/children успешно:", {
      unitId,
      childrenCount: children.length
    });

    return NextResponse.json({ 
      ok: true, 
      data: children 
    });
  } catch (err: any) {
    console.error("❌ GET /api/disassembly/unit/[unitId]/children ошибка:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}