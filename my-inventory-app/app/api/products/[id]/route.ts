// app/api/products/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET — получить один продукт
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, brand: true },
  });
  if (!product) return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: product });
}

/**
 * PATCH — редактировать продукт
 * body: { name?, code?, description?, categoryId?, brandId? }
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: body,
  });

  return NextResponse.json({ ok: true, data: updatedProduct });
}

/**
 * DELETE — запрещаем удаление
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ ok: false, error: "Deleting products is not allowed" }, { status: 403 });
}
