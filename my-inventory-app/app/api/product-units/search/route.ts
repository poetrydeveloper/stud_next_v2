// app/api/product-units/search/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ ok: true, data: [] });
    }

    const units = await prisma.productUnit.findMany({
      where: {
        OR: [
          { productName: { contains: query, mode: 'insensitive' } },
          { productCode: { contains: query, mode: 'insensitive' } },
          { serialNumber: { contains: query, mode: 'insensitive' } },
          { product: { 
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { code: { contains: query, mode: 'insensitive' } }
            ]
          }}
        ],
        statusProduct: 'IN_STORE' // Только товары на складе
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      take: 20
    });

    return NextResponse.json({ ok: true, data: units });
  } catch (err: any) {
    console.error("❌ GET /api/product-units/search ошибка:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}