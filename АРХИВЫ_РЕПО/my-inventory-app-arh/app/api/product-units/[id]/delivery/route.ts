// app/api/product-units/[id]/delivery/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitCardStatus, ProductUnitPhysicalStatus } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const unitId = Number(id);

  try {
    const unit = await prisma.productUnit.findUnique({
      where: { id: unitId }
    });

    if (!unit) {
      return NextResponse.json({ ok: false, error: "Unit not found" }, { status: 404 });
    }

    if (unit.statusCard !== ProductUnitCardStatus.IN_REQUEST) {
      return NextResponse.json({ ok: false, error: "Unit must be in IN_REQUEST status" }, { status: 400 });
    }

    const updatedUnit = await prisma.$transaction(async (tx) => {
      // 1. IN_REQUEST → IN_DELIVERY
      const inDeliveryUnit = await tx.productUnit.update({
        where: { id: unitId },
        data: {
          statusCard: ProductUnitCardStatus.IN_DELIVERY,
          logs: {
            create: {
              type: "DELIVERY_START",
              message: "Товар принят в доставку",
              meta: { previousStatus: unit.statusCard }
            }
          }
        }
      });

      // 2. IN_DELIVERY → ARRIVED (автоматически)
      const arrivedUnit = await tx.productUnit.update({
        where: { id: unitId },
        data: {
          statusCard: ProductUnitCardStatus.ARRIVED,
          logs: {
            create: {
              type: "DELIVERY_ARRIVED", 
              message: "Товар прибыл на склад",
              meta: { previousStatus: ProductUnitCardStatus.IN_DELIVERY }
            }
          }
        }
      });

      // 3. ARRIVED → IN_STORE (автоматически)
      const inStoreUnit = await tx.productUnit.update({
        where: { id: unitId },
        data: {
          statusCard: ProductUnitCardStatus.IN_STORE,
          statusProduct: ProductUnitPhysicalStatus.IN_STORE,
          logs: {
            create: {
              type: "IN_STORE",
              message: "Товар размещен на складе",
              meta: { 
                previousCardStatus: ProductUnitCardStatus.ARRIVED,
                previousProductStatus: unit.statusProduct
              }
            }
          }
        }
      });

      return inStoreUnit;
    });

    return NextResponse.json({ ok: true, data: updatedUnit });

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}