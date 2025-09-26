import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET /api/spines/tree
 * Возвращает дерево spine по категориям
 */
export async function GET() {
  try {
    const spines = await prisma.spine.findMany({
      include: {
        category: true,
      },
      orderBy: { name: "asc" },
    });

    // Формируем дерево: category -> spines
    const tree: Record<string, any[]> = {};
    spines.forEach((spine) => {
      const catName = spine.category?.name || "Без категории";
      if (!tree[catName]) tree[catName] = [];
      tree[catName].push({ id: spine.id, name: spine.name });
    });

    return NextResponse.json({ ok: true, data: tree });
  } catch (err: any) {
    console.error("GET /api/spines/tree error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
