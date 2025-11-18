// app/api/products/[id]/categories-spines/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id);

    if (!productId) {
      return NextResponse.json(
        { ok: false, error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const spines = await prisma.spine.findMany({
      where: { categoryId: product.categoryId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      ok: true,
      data: {
        category: product.category || null,
        spines,
      },
    });
  } catch (err) {
    console.error("Ошибка в categories-spines API:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
