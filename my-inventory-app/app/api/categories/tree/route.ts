// app/api/categories/tree/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET — возвращает дерево категорий для селекторов
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, parentId: true },
      orderBy: { name: "asc" },
    });

    // Если нужно, можно построить дерево, но для селекта плоский массив тоже подойдет
    return NextResponse.json({ ok: true, data: categories });
  } catch (err: any) {
    console.error("GET /api/categories/tree error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
