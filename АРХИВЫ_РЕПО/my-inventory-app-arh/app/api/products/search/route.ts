// app/api/products/search/route.ts (ПОЛНОСТЬЮ ПЕРЕПИСАННЫЙ - поиск ПРОДУКТОВ, не юнитов)
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ ok: true, data: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        brand: {
          select: {
            name: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        spine: {
          select: {
            name: true
          }
        },
        images: {
          where: { isMain: true },
          take: 1,
          select: {
            path: true
          }
        }
      },
      take: 20,
      orderBy: { name: 'asc' }
    });

    console.log("✅ GET /api/products/search успешно:", {
      query,
      found: products.length
    });

    return NextResponse.json({ ok: true, data: products });
  } catch (err: any) {
    console.error("❌ GET /api/products/search ошибка:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}