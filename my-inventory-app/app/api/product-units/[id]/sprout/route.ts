// app/api/product-units/[id]/sprout/route.ts
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const { requests } = body; // [{ quantity, pricePerUnit }, ...]

  return await prisma.$transaction(async (tx) => {
    const parent = await tx.productUnit.update({
      where: { id },
      data: { statusCard: "SPROUTED" },
    });

    for (const r of requests) {
      await tx.productUnit.create({
        data: {
          productId: parent.productId,
          spineId: parent.spineId,
          parentProductUnitId: parent.id,
          statusCard: "IN_REQUEST",
          quantityInRequest: r.quantity,
          requestPricePerUnit: r.pricePerUnit,
          createdAtRequest: new Date(),
          productCode: parent.productCode,
          productName: parent.productName,
          productDescription: parent.productDescription,
          productCategoryId: parent.productCategoryId,
          productCategoryName: parent.productCategoryName,
        },
      });
    }

    await tx.productUnitLog.create({
      data: {
        productUnitId: id,
        type: "SPROUT",
        message: `Разветвление: создано ${requests.length} заявок`,
      },
    });

    return NextResponse.json({ ok: true });
  });
}
