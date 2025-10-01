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
      orderBy: { path: "asc" }, // Меняем сортировку на path
      select: {
        id: true,
        name: true,
        slug: true,
        path: true, // Добавляем path
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
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { ok: false, error: "Некорректное имя категории" },
        { status: 400 }
      );
    }

    let parentPath = "/"; // По умолчанию корневой путь

    // === Если есть родитель - получаем его path ===
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
      parentPath = parent.path;
    }

    // === Генерация уникального slug ===
    let slug = generateSlug(name.trim());
    const originalSlug = slug;
    let counter = 1;

    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // === Создание категории (пока без path) ===
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        path: "temp", // Временное значение
      },
    });

    // === Обновляем path с ID новой категории ===
    const finalPath = `${parentPath}${category.id}/`;
    const updatedCategory = await prisma.category.update({
      where: { id: category.id },
      data: { path: finalPath },
    });

    return NextResponse.json(
      {
        ok: true,
        data: updatedCategory,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Ошибка при создании категории:", error);

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