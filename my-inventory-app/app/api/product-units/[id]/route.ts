//app/api/product-units/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { appendLog, getOrCreateCashDayId, recalcProductUnitStats } from "@/app/api/product-units/helpers";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const unit = await prisma.productUnit.findUnique({
      where: { id },
      include: {
        product: true,
        childProductUnits: true,
        cashEvents: true,
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
//app/api/product-units/[id]/route.ts
/**
 * PATCH — обновление единицы товара (продажа, возврат, кредит)
 * body: {
 *   action: "sell" | "return" | "creditPay",
 *   salePrice?: number,
 *   buyerName?: string,
 *   buyerPhone?: string
 * }
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const unitId = Number(params.id);
    const data = await req.json();
    const { action, salePrice, buyerName, buyerPhone } = data;

    if (!unitId) {
      return NextResponse.json({ ok: false, error: "Missing unit ID" }, { status: 400 });
    }

    const unit = await prisma.productUnit.findUnique({ where: { id: unitId } });
    if (!unit) {
      return NextResponse.json({ ok: false, error: "Product unit not found" }, { status: 404 });
    }

    let updateData: any = {};
    let logEvent: any = null;

    if (action === "sell") {
      updateData = {
        statusProduct: unit.isCredit ? "CREDIT" : "SOLD",
        soldAt: new Date(),
        salePrice: salePrice || 0,
        buyerName: buyerName || null,
        buyerPhone: buyerPhone || null,
        isCredit: !!(salePrice === 0),
        logs: appendLog(unit.logs, {
          event: "SOLD",
          at: new Date().toISOString(),
          buyerName,
          buyerPhone,
          salePrice,
        }),
      };
      logEvent = "SOLD";
    } else if (action === "return") {
      updateData = {
        statusProduct: "IN_STORE",
        isReturned: true,
        returnedAt: new Date(),
        logs: appendLog(unit.logs, {
          event: "RETURN",
          at: new Date().toISOString(),
          buyerName: unit.buyerName,
          buyerPhone: unit.buyerPhone,
        }),
      };
      logEvent = "RETURN";
    } else if (action === "creditPay") {
      if (!unit.isCredit) {
        return NextResponse.json({ ok: false, error: "Unit is not on credit" }, { status: 400 });
      }
      updateData = {
        salePrice: salePrice || unit.salePrice,
        creditPaidAt: new Date(),
        statusProduct: "SOLD",
        logs: appendLog(unit.logs, {
          event: "CREDIT_PAID",
          at: new Date().toISOString(),
          buyerName: unit.buyerName,
          buyerPhone: unit.buyerPhone,
          salePrice,
        }),
      };
      logEvent = "CREDIT_PAID";
    } else {
      return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
    }

    const updatedUnit = await prisma.productUnit.update({
      where: { id: unitId },
      data: updateData,
      include: { product: true },
    });

    // Обновляем статистику продукта
    await recalcProductUnitStats(updatedUnit.productId);

    return NextResponse.json({ ok: true, data: updatedUnit, logEvent });
  } catch (err: any) {
    console.error("PATCH /api/product-units/[id] error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
