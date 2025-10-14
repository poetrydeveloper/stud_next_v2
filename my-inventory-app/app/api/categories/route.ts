// app/api/categories/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generateSlug } from "@/app/lib/translit";

/**
 * GET — Получить список всех категорий (плоский список)
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { path: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        path: true,
      },
    });

    return NextResponse.json({
      ok: true,
      data: categories,
    });
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось получить список категорий" },
      { status: 500 }
    );
  }
}

/**
 * POST — Создать новую категорию с Materialized Path
 */
export async function POST(req: Request) {
  try {
    const { name, parentId } = await req.json();

    // === Валидация ===
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Некорректное имя категории" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    // === Генерация уникального slug ===
    let slug = generateSlug(trimmedName);
    const originalSlug = slug;
    let counter = 1;

    // Проверяем уникальность slug
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // === Определяем path на основе родителя ===
    let finalPath = `/${slug}`;

    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
        select: { path: true }
      });

      if (!parent) {
        return NextResponse.json(
          { ok: false, error: "Родительская категория не найдена" },
          { status: 404 }
        );
      }
      finalPath = `${parent.path}/${slug}`;
    }

    // === Проверяем уникальность path ===
    const existingPath = await prisma.category.findUnique({
      where: { path: finalPath }
    });

    if (existingPath) {
      return NextResponse.json(
        { ok: false, error: "Категория с таким путем уже существует" },
        { status: 409 }
      );
    }

    // === Создаем категорию за один запрос ===
    const category = await prisma.category.create({
      data: {
        name: trimmedName,
        slug,
        path: finalPath,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        data: category,
        message: "Категория успешно создана"
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Ошибка при создании категории:", error);

    if (error?.code === "P2002") {
      const target = error.meta?.target;
      if (target?.includes('slug')) {
        return NextResponse.json(
          { ok: false, error: "Категория с таким slug уже существует" },
          { status: 409 }
        );
      }
      if (target?.includes('path')) {
        return NextResponse.json(
          { ok: false, error: "Категория с таким путем уже существует" },
          { status: 409 }
        );
      }
      if (target?.includes('id')) {
        return NextResponse.json(
          { ok: false, error: "Конфликт ID категории" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { ok: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}