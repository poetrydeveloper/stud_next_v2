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

    if (!["CANDIDATE", "IN_REQUEST", "EXTRA"].includes(String(status))) {
      return NextResponse.json({ error: "Неверный статус" }, { status: 400 });
    }

    const item = await prisma.requestItem.findUnique({
      where: { id },
      include: { request: true },
    });
    if (!item) return NextResponse.json({ error: "Позиция не найдена" }, { status: 404 });

    let requestToUseId: number | null = null;

    if (status === "IN_REQUEST" || status === "EXTRA") {
      if (requestId) {
        // привяжем к существующей заявке
        const reqExist = await prisma.request.findUnique({ where: { id: Number(requestId) } });
        if (!reqExist) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
        requestToUseId = reqExist.id;
      } else {
        // создадим новую заявку на лету
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
        requestId: requestToUseId, // null если снова кандидат
      },
      include: { request: true, product: true },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Не удалось обновить статус" }, { status: 500 });
  }
}
