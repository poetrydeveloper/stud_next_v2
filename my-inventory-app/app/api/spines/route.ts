// app/api/spines/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const where: any = {};
    if (categoryId) where.categoryId = Number(categoryId);

    const spines = await prisma.spine.findMany({
      where,
      include: {
        category: true,
        productUnits: { // ← ТОЛЬКО productUnits, без products
          include: {
            product: {
              select: {
                brand: true // ← бренд продукта для unit
              }
            }
          }
        },
        _count: {
          select: {
            productUnits: true
          }
        }
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ ok: true, data: spines });
  } catch (error: any) {
    console.error("GET /api/spines error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}