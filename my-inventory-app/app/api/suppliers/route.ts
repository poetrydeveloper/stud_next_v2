// app/api/suppliers/route.ts
import { NextResponse } from "next/server";
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    // ИСПРАВЛЕНО: используем prisma.supplier (единственное число)
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ ok: true, data: suppliers });
  } catch (error: any) {
    console.error("Ошибка при получении поставщиков:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { ok: false, error: "Название поставщика обязательно" },
        { status: 400 }
      );
    }

    // ИСПРАВЛЕНО: используем prisma.supplier (единственное число)
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

    if (error.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "Поставщик с таким названием уже существует" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}