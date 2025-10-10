// app/api/product-units/[id]/logs/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const unitId = Number((await params).id);

    const logs = await prisma.productUnitLog.findMany({
      where: { productUnitId: unitId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, data: logs });
  } catch (error: any) {
    console.error("GET /api/product-units/[id]/logs error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
