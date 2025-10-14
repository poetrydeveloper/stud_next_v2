// app/api/product-units/[id]/return/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitPhysicalStatus, CashEventType } from "@prisma/client";
import { CashEventService } from "@/app/lib/cash";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const unitId = Number(id);

    const { returnReason = "Возврат товара" } = await req.json();

    // Находим товар
    const productUnit = await prisma.productUnit.findUnique({
      where: { id: unitId },
      include: {
        product: true
      }
    });

    if (!productUnit) {
      return NextResponse.json(
        { ok: false, error: "Товарная единица не найдена" },
        { status: 404 }
      );
    }

    // Проверяем что товар продан
    if (productUnit.statusProduct !== ProductUnitPhysicalStatus.SOLD && 
        productUnit.statusProduct !== ProductUnitPhysicalStatus.CREDIT) {
      return NextResponse.json(
        { ok: false, error: "Можно вернуть только проданный товар" },
        { status: 400 }
      );
    }

    return await prisma.$transaction(async (tx) => {
      // Обновляем статус товара
      const updatedUnit = await tx.productUnit.update({
        where: { id: unitId },
        data: {
          statusProduct: ProductUnitPhysicalStatus.IN_STORE,
          salePrice: null,
          soldAt: null,
          isCredit: false,
          customerId: null,
          logs: {
            create: {
              type: "RETURN",
              message: `Товар возвращен. Причина: ${returnReason}`,
              meta: {
                returnReason,
                previousStatus: productUnit.statusProduct,
                previousSalePrice: productUnit.salePrice
              }
            }
          }
        }
      });

      // Создаем кассовое событие возврата (только для обычных продаж)
      if (productUnit.statusProduct === ProductUnitPhysicalStatus.SOLD && productUnit.salePrice) {
        await CashEventService.createReturnEvent(
          unitId,
          productUnit.salePrice,
          productUnit.productName || productUnit.product?.name,
          returnReason
        );
      }

      return NextResponse.json({
        ok: true,
        data: updatedUnit,
        message: "Товар успешно возвращен"
      });
    });

  } catch (error: any) {
    console.error("Ошибка при возврате товара:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}