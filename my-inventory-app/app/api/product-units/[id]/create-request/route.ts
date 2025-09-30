// app/api/product-units/[id]/create-request/route.ts
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const { quantity, pricePerUnit } = body;

  return await prisma.$transaction(async (tx) => {
    const unit = await tx.productUnit.findUnique({ where: { id } });
    if (!unit) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Сценарий 1: один к одному
    const updated = await tx.productUnit.update({
      where: { id },
      data: {
        statusCard: "IN_REQUEST",
        quantityInRequest: quantity,
        requestPricePerUnit: pricePerUnit,
        createdAtRequest: new Date(),
      },
    });

    // Создаем запись в логах
    await tx.productUnitLog.create({
      data: {
        productUnitId: id,
        type: "REQUEST",
        message: `Создана заявка на ${quantity} ед. по цене ${pricePerUnit ?? "-"}`
      }
    });

    return NextResponse.json(updated);
  });
}
