// app/api/spines/category/[categoryId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const categoryId = parseInt(params.categoryId);
    
    const spines = await prisma.spine.findMany({
      where: {
        categoryId: categoryId
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