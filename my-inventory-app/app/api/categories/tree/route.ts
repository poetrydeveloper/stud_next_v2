// app/api/categories/tree/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET — возвращает дерево категорий для селекторов
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        parentId: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      ok: true,
      data: categories,
    });
  } catch (error: any) {
    console.error("Ошибка при получении категорий:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Не удалось получить список категорий",
      },
      { status: 500 }
    );
  }
}
