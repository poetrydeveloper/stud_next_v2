// app/api/request-items/[id]/status/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// PATCH /api/request-items/:id/status
// body: { status: "CANDIDATE" | "IN_REQUEST" | "EXTRA", requestId?: number, notes?: string }
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const { status, requestId, notes } = await req.json();

    // Валидация статуса
    type ItemStatus = "CANDIDATE" | "IN_REQUEST" | "EXTRA";
    if (!["CANDIDATE", "IN_REQUEST", "EXTRA"].includes(status as ItemStatus)) {
      return NextResponse.json(
        { error: "Неверный статус" }, 
        { status: 400 }
      );
    }

    // Валидация requestId
    if (requestId && isNaN(Number(requestId))) {
      return NextResponse.json(
        { error: "Неверный ID заявки" },
        { status: 400 }
      );
    }

    const item = await prisma.requestItem.findUnique({
      where: { id },
      include: { 
        request: true,
        supplier: true,
        customer: true
      },
    });
    
    if (!item) {
      return NextResponse.json(
        { error: "Позиция не найдена" }, 
        { status: 404 }
      );
    }

    let requestToUseId: number | null = null;

    if (status === "IN_REQUEST" || status === "EXTRA") {
      if (requestId) {
        // Привяжем к существующей заявке
        const reqExist = await prisma.request.findUnique({ 
          where: { id: Number(requestId) } 
        });
        
        if (!reqExist) {
          return NextResponse.json(
            { error: "Заявка не найдена" },
            { status: 404 }
          );
        }
        
        requestToUseId = reqExist.id;
      } else {
        // Создадим новую заявку
        const newReq = await prisma.request.create({
          data: { notes: notes || null },
        });
        requestToUseId = newReq.id;
      }
    }

    const updated = await prisma.requestItem.update({
      where: { id },
      data: {
        status,
        requestId: requestToUseId,
        supplierId: item.supplierId,
        customerId: item.customerId
      },
      include: { 
        request: true, 
        product: true,
        supplier: true,
        customer: true
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Ошибка при обновлении статуса:", e);
    return NextResponse.json(
      { error: "Не удалось обновить статус" }, 
      { status: 500 }
    );
  }
}