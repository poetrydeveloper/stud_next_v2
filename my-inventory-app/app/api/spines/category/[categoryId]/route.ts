import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> } // ← Добавляем Promise
) {
  try {
    // Ждем params
    const { categoryId } = await params;
    const id = parseInt(categoryId);

    if (isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный ID категории" },
        { status: 400 }
      );
    }

    const spines = await prisma.spine.findMany({
      where: {
        categoryId: id
      },
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ 
      ok: true, 
      data: spines 
    });
  } catch (error: any) {
    console.error("Error fetching spines by category:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch spines" },
      { status: 500 }
    );
  }
}