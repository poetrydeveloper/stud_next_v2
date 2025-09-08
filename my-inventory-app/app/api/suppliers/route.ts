// app/api/suppliers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// ТОЛЬКО GET - получение поставщиков
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении поставщиков" },
      { status: 500 }
    );
  }
}

// УДАЛИТЬ POST метод отсюда!