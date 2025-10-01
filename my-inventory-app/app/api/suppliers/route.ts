// app/api/suppliers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET /api/suppliers — список всех поставщиков
 */
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ ok: true, data: suppliers });
  } catch (error) {
    console.error("Ошибка при получении поставщиков:", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось получить поставщиков" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/suppliers — создание нового поставщика
 * body: { name: string }
 */
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { ok: false, error: "Название поставщика обязательно" },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Поставщик успешно создан",
      data: supplier,
    });
  } catch (error: any) {
    console.error("Ошибка при создании поставщика:", error);

    // Проверяем ошибку уникальности
    if (error.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "Поставщик с таким названием уже существует" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Не удалось создать поставщика" },
      { status: 500 }
    );
  }
}