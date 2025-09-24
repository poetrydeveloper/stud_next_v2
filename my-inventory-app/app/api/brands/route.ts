// app/api/brands/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET — возвращает список брендов для селектора
 */
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ ok: true, data: brands });
  } catch (err: any) {
    console.error("GET /api/brands error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
