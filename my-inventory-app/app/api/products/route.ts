// app/api/products/route.ts

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET — список продуктов для селектора или таблицы.
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        categoryId: true,
        category: { select: { name: true } },
        brandId: true,
        brand: { select: { name: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ ok: true, data: products });
  } catch (err: any) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST — создание нового продукта.
 * body: { name, code, description?, categoryId?, brandId? }
 */
export async function POST(req: Request) {
  try {
    const { name, code, description, categoryId, brandId } = await req.json();

    if (!name || !code) {
      return NextResponse.json({ ok: false, error: "Name and code are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: { name, code, description, categoryId, brandId },
    });

    return NextResponse.json({ ok: true, data: product });
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
