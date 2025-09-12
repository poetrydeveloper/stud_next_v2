//app/api/brands/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// GET /api/brands — список всех брендов
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Ошибка при получении брендов:", error);
    return NextResponse.json(
      { error: "Не удалось получить бренды" }, 
      { status: 500 }
    );
  }
}

// POST /api/brands — создание нового бренда
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Название бренда обязательно" },
        { status: 400 }
      );
    }

    // Создаем slug из названия
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    const brand = await prisma.brand.create({
      data: {
        name,
        slug
      }
    });

    return NextResponse.json(
      { 
        success: true,
        message: "Бренд успешно создан", 
        brand 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Ошибка при создании бренда:", error);
    
    // Проверяем ошибку уникальности
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: "Бренд с таким названием уже существует" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Не удалось создать бренд" },
      { status: 500 }
    );
  }
}