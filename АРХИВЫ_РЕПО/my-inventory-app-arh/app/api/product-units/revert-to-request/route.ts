//app/api/product-units/revert-to-request
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { unitId } = await req.json();
    
    if (!unitId) {
      return NextResponse.json(
        { ok: false, error: "unitId is required" },
        { status: 400 }
      );
    }

    // Находим unit и проверяем, что он в статусе IN_STORE
    const unit = await prisma.productUnit.findUnique({
      where: { id: unitId },
    });

    if (!unit) {
      return NextResponse.json(
        { ok: false, error: "Product unit not found" },
        { status: 404 }
      );
    }

    if (unit.statusProduct !== "IN_STORE") {
      return NextResponse.json(
        { ok: false, error: "Product unit is not in IN_STORE status" },
        { status: 400 }
      );
    }

    // Обновляем статусы: card -> IN_REQUEST, product -> null
    const updatedUnit = await prisma.productUnit.update({
      where: { id: unitId },
      data: {
        statusCard: "IN_REQUEST", // Возвращаем в статус запроса
        statusProduct: null,      // Сбрасываем физический статус
      },
    });

    // Создаем запись в логах
    await prisma.productUnitLog.create({
      data: {
        productUnitId: unitId,
        type: "STATUS_CHANGE",
        message: `Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)`,
        meta: {
          previousCardStatus: unit.statusCard,
          previousProductStatus: unit.statusProduct,
          newCardStatus: "IN_REQUEST",
          newProductStatus: null,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({ 
      ok: true, 
      data: updatedUnit 
    });

  } catch (error: any) {
    console.error("POST /api/product-units/revert-to-request error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}