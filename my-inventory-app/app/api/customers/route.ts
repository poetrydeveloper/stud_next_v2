// app/api/customers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET /api/customers — список всех клиентов
 */
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ ok: true, data: customers });
  } catch (error) {
    console.error("Ошибка при получении клиентов:", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось получить клиентов" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customers — создание нового клиента
 * body: { name: string, phone?: string, notes?: string }
 */
export async function POST(req: Request) {
  try {
    const { name, phone, notes } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { ok: false, error: "Имя клиента обязательно" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Клиент успешно создан",
      data: customer,
    });
  } catch (error: any) {
    console.error("Ошибка при создании клиента:", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось создать клиента" },
      { status: 500 }
    );
  }
}