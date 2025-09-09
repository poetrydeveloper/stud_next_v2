// app/api/suppliers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// GET /api/suppliers - получение списка поставщиков
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    const suppliers = await prisma.supplier.findMany({
      where: search ? {
        name: { contains: search, mode: 'insensitive' }
      } : {},
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        contactPerson: true,
        phone: true,
        notes: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Ошибка при получении поставщиков:", error);
    return NextResponse.json(
      { error: "Ошибка при получении поставщиков" },
      { status: 500 }
    );
  }
}

// POST /api/suppliers - создание нового поставщика
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валидация обязательных полей
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: "Имя поставщика обязательно" },
        { status: 400 }
      );
    }

    // Проверка на уникальность имени
    const existingSupplier = await prisma.supplier.findFirst({
      where: { name: body.name.trim() }
    });

    if (existingSupplier) {
      return NextResponse.json(
        { error: "Поставщик с таким именем уже существует" },
        { status: 409 }
      );
    }

    // Создание поставщика
    const supplier = await prisma.supplier.create({
      data: {
        name: body.name.trim(),
        contactPerson: body.contactPerson?.trim() || "Не указано",
        phone: body.phone?.trim() || "Не указано",
        notes: body.notes?.trim() || null
      }
    });

    return NextResponse.json(
      { 
        message: "Поставщик успешно создан",
        supplier: supplier 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Ошибка при создании поставщика:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}