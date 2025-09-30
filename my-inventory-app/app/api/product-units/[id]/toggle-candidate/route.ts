// app/api/product-units/[id]/toggle-candidate/route.ts
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const unit = await prisma.productUnit.findUnique({ where: { id } });
  if (!unit) return NextResponse.json({ error: "Unit not found" }, { status: 404 });

  const newStatus = unit.statusCard === "CANDIDATE" ? "CLEAR" : "CANDIDATE";

  const updated = await prisma.productUnit.update({
    where: { id },
    data: { statusCard: newStatus },
  });

  await prisma.productUnitLog.create({
    data: {
      productUnitId: id,
      type: "STATUS_CHANGE",
      message: `Статус изменён на ${newStatus}`,
    },
  });

  return NextResponse.json(updated);
}
