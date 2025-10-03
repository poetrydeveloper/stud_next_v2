// app/api/product-units/[id]/sprout/route.ts
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { copyParentUnitData, generateSerialNumber } from "@/app/api/product-units/helpers";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const { requests } = body;

  return await prisma.$transaction(async (tx) => {
    const parent = await tx.productUnit.findUnique({ 
      where: { id },
      include: {
        product: {
          include: {
            brand: true
          }
        }
      }
    });
    
    if (!parent) {
      return NextResponse.json({ ok: false, error: "Parent unit not found" }, { status: 404 });
    }

    // Обновляем родителя в SPROUTED
    const updatedParent = await tx.productUnit.update({
      where: { id },
      data: { statusCard: "SPROUTED" },
    });

    const createdChildren = [];

    // Создаем дочерние units
    for (const r of requests) {
      // ✅ ИСПРАВЛЕНО: используем функцию копирования
      const childData = copyParentUnitData(parent, {
        quantityInRequest: r.quantity,
        requestPricePerUnit: r.pricePerUnit || parent.requestPricePerUnit,
        serialNumber: await generateSerialNumber(prisma, parent.productId, parent.id),
        parentProductUnitId: parent.id,
      });

      const childUnit = await tx.productUnit.create({
        data: childData,
      });

      createdChildren.push(childUnit);

      // Логируем создание каждого ребенка
      await tx.productUnitLog.create({
        data: {
          productUnitId: childUnit.id,
          type: "SYSTEM",
          message: `Дочерний unit создан из родителя ${parent.serialNumber}`,
          meta: {
            parentUnitId: parent.id,
            parentSerialNumber: parent.serialNumber
          }
        },
      });
    }

    // Логируем операцию sprout у родителя
    await tx.productUnitLog.create({
      data: {
        productUnitId: id,
        type: "SPROUT",
        message: `Разветвление: создано ${requests.length} дочерних заявок`,
        meta: {
          childrenCount: requests.length,
          children: createdChildren.map(c => ({
            id: c.id,
            serialNumber: c.serialNumber
          }))
        }
      },
    });

    return NextResponse.json({ 
      ok: true, 
      data: {
        parent: updatedParent,
        children: createdChildren,
        childrenCount: requests.length
      }
    });
  });
}