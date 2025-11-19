import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    console.log('🔍 GET /api/spines/simple - categoryId:', categoryId);

    const where = categoryId ? { categoryId: parseInt(categoryId) } : {};

    const spines = await prisma.spine.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        node_index: true,
        human_path: true,
        category: {
          select: {
            id: true,
            name: true,
            node_index: true,
            human_path: true
          }
        }
      },
      where,
      orderBy: { name: "asc" },
    });

    console.log('✅ Found spines for modal:', spines.length);

    return NextResponse.json({ 
      ok: true, 
      data: spines
    });
  } catch (err: any) {
    console.error("💥 Ошибка API /spines/simple:", err);
    return NextResponse.json({ 
      ok: false, 
      error: err.message 
    }, { status: 500 });
  }
}