// app/api/product-units/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitPhysicalStatus, CashEventType } from "@prisma/client";
import { CashDayService } from "@/app/lib/cashDayService";
import { recalcProductUnitStats } from "@/app/api/product-units/helpers";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const unit = await prisma.productUnit.findUnique({
      where: { id },
      include: {
        spine: true,
        supplier: true,
        customer: true,
        product: {
          include: {
            brand: true,
            category: true,
            images: true
          }
        },
        childProductUnits: true,
        cashEvents: {
          include: {
            cashDay: true
          }
        },
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      },
    });

    if (!unit) {
      return NextResponse.json({ ok: false, error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: unit });
  } catch (err: any) {
    console.error("GET /api/product-units/[id] error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const unitId = Number(params.id);
    const data = await req.json();
    const { action, salePrice, buyerName, buyerPhone } = data;

    if (!unitId) {
      return NextResponse.json({ ok: false, error: "Missing unit ID" }, { status: 400 });
    }

    // Для продаж проверяем что день открыт
    if (action === "sell" || action === "creditPay") {
      await CashDayService.validateCashDayOpen();
    }

    return await prisma.$transaction(async (tx) => {
      const unit = await tx.productUnit.findUnique({ 
        where: { id: unitId },
        include: { product: true }
      });
      
      if (!unit) {
        throw new Error("Product unit not found");
      }

      let updateData: any = {};
      let cashEventData: any = null;
      let logMessage = "";

      if (action === "sell") {
        if (unit.statusProduct !== ProductUnitPhysicalStatus.IN_STORE) {
          throw new Error("Unit is not in store");
        }

        const isCredit = salePrice === 0;
        
        updateData = {
          statusProduct: isCredit ? ProductUnitPhysicalStatus.CREDIT : ProductUnitPhysicalStatus.SOLD,
          soldAt: new Date(),
          salePrice: salePrice || 0,
          customerName: buyerName || null,
          customerPhone: buyerPhone || null,
          isCredit: isCredit,
          logs: {
            create: {
              type: "SALE",
              message: `Товар продан${isCredit ? ' в кредит' : ''} за ${salePrice || 0} руб.`,
              meta: {
                event: "SOLD",
                salePrice,
                buyerName,
                buyerPhone,
                isCredit
              }
            }
          }
        };

        // Создаем CashEvent только если не кредит
        if (!isCredit) {
          const currentCashDay = await CashDayService.getCurrentCashDay();
          cashEventData = {
            type: CashEventType.SALE,
            amount: salePrice || 0,
            notes: `Продажа: ${unit.productName}`,
            cashDayId: currentCashDay.id,
            productUnitId: unitId
          };
        }

      } else if (action === "return") {
        if (unit.statusProduct !== ProductUnitPhysicalStatus.SOLD && 
            unit.statusProduct !== ProductUnitPhysicalStatus.CREDIT) {
          throw new Error("Unit is not sold");
        }

        updateData = {
          statusProduct: ProductUnitPhysicalStatus.IN_STORE,
          isReturned: true,
          returnedAt: new Date(),
          logs: {
            create: {
              type: "RETURN", 
              message: `Товар возвращен`,
              meta: {
                event: "RETURN",
                originalSalePrice: unit.salePrice
              }
            }
          }
        };

        // CashEvent для возврата
        if (unit.salePrice && unit.salePrice > 0) {
          const currentCashDay = await CashDayService.getCurrentCashDay();
          cashEventData = {
            type: CashEventType.RETURN,
            amount: -unit.salePrice,
            notes: `Возврат: ${unit.productName}`,
            cashDayId: currentCashDay.id,
            productUnitId: unitId
          };
        }

      } else if (action === "creditPay") {
        if (!unit.isCredit || unit.statusProduct !== ProductUnitPhysicalStatus.CREDIT) {
          throw new Error("Unit is not on credit");
        }

        updateData = {
          statusProduct: ProductUnitPhysicalStatus.SOLD,
          creditPaidAt: new Date(),
          salePrice: salePrice || unit.salePrice,
          logs: {
            create: {
              type: "CREDIT_PAYMENT",
              message: `Кредит погашен на сумму ${salePrice || unit.salePrice || 0} руб.`,
              meta: {
                event: "CREDIT_PAID",
                amountPaid: salePrice || unit.salePrice
              }
            }
          }
        };

        // CashEvent для оплаты кредита
        const currentCashDay = await CashDayService.getCurrentCashDay();
        cashEventData = {
          type: CashEventType.SALE,
          amount: salePrice || unit.salePrice || 0,
          notes: `Оплата кредита: ${unit.productName}`,
          cashDayId: currentCashDay.id,
          productUnitId: unitId
        };

      } else {
        throw new Error("Invalid action");
      }

      const updatedUnit = await tx.productUnit.update({
        where: { id: unitId },
        data: updateData,
        include: { product: true },
      });

      // Создаем CashEvent если нужно
      if (cashEventData) {
        await tx.cashEvent.create({
          data: cashEventData
        });
      }

      await recalcProductUnitStats(updatedUnit.productId);

      return NextResponse.json({ 
        ok: true, 
        data: updatedUnit 
      });
    });

  } catch (err: any) {
    console.error("PATCH /api/product-units/[id] error:", err);
    return NextResponse.json({ 
      ok: false, 
      error: err.message 
    }, { status: 500 });
  }
}