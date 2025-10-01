// app/api/customers/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET /api/customers/[id] — получить клиента по ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный ID клиента" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json(
        { ok: false, error: "Клиент не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: customer });
  } catch (error) {
    console.error("Ошибка при получении клиента:", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось получить клиента" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/customers/[id] — обновить клиента
 * body: { name?: string, phone?: string, notes?: string }
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный ID клиента" },
        { status: 400 }
      );
    }

    const { name, phone, notes } = await request.json();

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Клиент успешно обновлен",
      data: customer,
    });
  } catch (error: any) {
    console.error("Ошибка при обновлении клиента:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { ok: false, error: "Клиент не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Не удалось обновить клиента" },
      { status: 500 }
    );
  }
}