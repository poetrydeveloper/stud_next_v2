// app/api/product-units/[id]/sale/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitPhysicalStatus } from "@prisma/client";
import { CashDayService } from "@/app/lib/cashDayService";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const unitId = Number(id);

  try {
    const body = await req.json();
    const { salePrice, buyerName, buyerPhone, isCredit = false } = body;

    // Валидация
    if (!salePrice && salePrice !== 0) {
      return NextResponse.json({ ok: false, error: "salePrice is required" }, { status: 400 });
    }

    if (isCredit && (!buyerName || !buyerPhone)) {
      return NextResponse.json({ ok: false, error: "buyerName and buyerPhone required for credit" }, { status: 400 });
    }

    // Проверяем что день открыт (для не-кредитных продаж)
    if (!isCredit && salePrice > 0) {
      await CashDayService.validateCashDayOpen();
    }

    const unit = await prisma.productUnit.findUnique({
      where: { id: unitId }
    });

    if (!unit) {
      return NextResponse.json({ ok: false, error: "Unit not found" }, { status: 404 });
    }

    if (unit.statusProduct !== ProductUnitPhysicalStatus.IN_STORE) {
      return NextResponse.json({ ok: false, error: "Unit must be in IN_STORE status" }, { status: 400 });
    }

    const updatedUnit = await prisma.$transaction(async (tx) => {
      // Для кредитных продаж создаем/находим покупателя
      let customerId: number | undefined;
      
      if (isCredit && buyerName && buyerPhone) {
        // Ищем существующего покупателя или создаем нового
        let customer = await tx.customer.findFirst({
          where: {
            name: buyerName,
            phone: buyerPhone
          }
        });

        if (!customer) {
          customer = await tx.customer.create({
            data: {
              name: buyerName,
              phone: buyerPhone
            }
          });
        }
        
        customerId = customer.id;
      }

      // Обновляем unit
      const updateData: any = {
        statusProduct: isCredit ? ProductUnitPhysicalStatus.CREDIT : ProductUnitPhysicalStatus.SOLD,
        salePrice: salePrice,
        soldAt: new Date(),
        isCredit: isCredit,
        logs: {
          create: {
            type: isCredit ? "CREDIT_SALE" : "SALE",
            message: `Товар ${isCredit ? 'продан в кредит' : 'продан'} за ${salePrice} ₽${buyerName ? ` покупателю ${buyerName}` : ''}`,
            meta: {
              salePrice,
              buyerName,
              buyerPhone,
              isCredit
            }
          }
        }
      };

      // Добавляем связь с покупателем для кредитных продаж
      if (customerId) {
        updateData.customerId = customerId;
      }

      const soldUnit = await tx.productUnit.update({
        where: { id: unitId },
        data: updateData
      });

      // Создаем CashEvent для не-кредитных продаж
      if (!isCredit && salePrice > 0) {
        const currentCashDay = await CashDayService.getCurrentCashDay();
        if (currentCashDay) {
          await tx.cashEvent.create({
            data: {
              type: "SALE",
              amount: salePrice,
              notes: `Продажа: ${unit.productName || 'товар'}`,
              cashDayId: currentCashDay.id,
              productUnitId: unitId
            }
          });
        }
      }

      return soldUnit;
    });

    return NextResponse.json({ ok: true, data: updatedUnit });

  } catch (err: any) {
    console.error("Sale error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}