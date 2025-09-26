import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generateSlug } from "@/app/lib/translit";

/**
 * GET — Получить список всех категорий (плоский список)
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
      },
    });

    return NextResponse.json({
      ok: true,
      data: categories,
    });
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Не удалось получить список категорий",
      },
      { status: 500 }
    );
  }
}

/**
 * POST — Создать новую категорию
 */
export async function POST(req: Request) {
  try {
    const { name, parentId } = await req.json();

    // === Валидация ===
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { ok: false, error: "Некорректное имя категории" },
        { status: 400 }
      );
    }

    if (parentId && typeof parentId !== "number") {
      return NextResponse.json(
        { ok: false, error: "Некорректный parentId" },
        { status: 400 }
      );
    }

    // === Генерация уникального slug ===
    let slug = generateSlug(name.trim());
    const originalSlug = slug;
    let counter = 1;

    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // === Проверка существования родительской категории ===
    if (parentId) {
      const parentExists = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentExists) {
        return NextResponse.json(
          { ok: false, error: "Родительская категория не найдена" },
          { status: 404 }
        );
      }
    }

    // === Создание категории ===
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        data: category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Ошибка при создании категории:", error);

    // Prisma ошибка уникальности
    if (error?.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "Категория с таким slug уже существует" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}