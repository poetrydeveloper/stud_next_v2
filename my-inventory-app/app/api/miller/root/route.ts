// app/api/miller/root/route.ts - если есть params, тоже добавь await
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET — Корневые категории для Miller Columns
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parent_id: null
      },
      select: {
        id: true,
        name: true,
        slug: true,
        path: true,
        node_index: true,
        human_path: true,
        _count: {
          select: {
            children: true,
            products: true,
            spines: true
          }
        }
      },
      orderBy: { node_index: "asc" }
    });

    return NextResponse.json({
      ok: true,
      data: categories,
    });
  } catch (error) {
    console.error("Ошибка при получении корневых категорий:", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось получить корневые категории" },
      { status: 500 }
    );
  }
}