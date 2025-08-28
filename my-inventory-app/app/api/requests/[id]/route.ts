// app/api/requests/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// GET /api/requests/:id
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const data = await prisma.request.findUnique({
      where: { id },
      include: {
        items: { include: { product: { include: { images: true, category: true } } } },
      },
    });
    if (!data) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Не удалось получить заявку" }, { status: 500 });
  }
}
