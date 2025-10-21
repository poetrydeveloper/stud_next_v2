// app/api/categories/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generateSlug } from "@/lib/translit";
import { nodeIndexService } from "@/app/lib/node-index/NodeIndexService";

/**
 * GET — Получить список всех категорий (плоский список)
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { node_index: "asc" }, // Сортируем по node_index
      select: {
        id: true,
        name: true,
        slug: true,
        path: true,
        node_index: true,
        human_path: true,
        parent_id: true,
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
 * POST — Создать новую категорию с Node Index системой
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

    // === Находим родительскую категорию ===
    let parentCategory = null;
    if (parentId) {
      parentCategory = await prisma.category.findUnique({
        where: { id: parentId }
      });

      if (!parentCategory) {
        return NextResponse.json(
          { ok: false, error: "Родительская категория не найдена" },
          { status: 404 }
        );
      }
    }

    // === Генерируем Node Index и Human Path ===
    const indexes = await nodeIndexService.generateCategoryIndex(parentCategory, trimmedName);

    // === Определяем path на основе родителя (для совместимости) ===
    let finalPath = `/${slug}`;
    if (parentCategory) {
      finalPath = `${parentCategory.path}/${slug}`;
    }

    // === Проверяем уникальность path (для совместимости) ===
    const existingPath = await prisma.category.findUnique({
      where: { path: finalPath }
    });

    if (existingPath) {
      return NextResponse.json(
        { ok: false, error: "Категория с таким путем уже существует" },
        { status: 409 }
      );
    }

    // === Проверяем уникальность node_index ===
    const existingNodeIndex = await prisma.category.findUnique({
      where: { node_index: indexes.node_index }
    });

    if (existingNodeIndex) {
      return NextResponse.json(
        { ok: false, error: "Конфликт node_index" },
        { status: 409 }
      );
    }

    // === Создаем категорию ===
    const category = await prisma.category.create({
      data: {
        name: trimmedName,
        slug,
        path: finalPath,           // для совместимости
        node_index: indexes.node_index,
        human_path: indexes.human_path,
        parent_id: parentId || null,
      },
    });

    console.log("✅ Категория создана с node_index:", {
      id: category.id,
      name: category.name,
      node_index: category.node_index,
      human_path: category.human_path
    });

    return NextResponse.json(
      {
        ok: true,
        data: category,
        message: "Категория успешно создана с Node Index системой"
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Ошибка при создании категории:", error);

    // Обработка ошибок уникальности
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
      if (target?.includes('node_index')) {
        return NextResponse.json(
          { ok: false, error: "Конфликт node_index" },
          { status: 409 }
        );
      }
    }

    // Обработка ошибок из NodeIndexService
    if (error.message?.includes('node_index') || error.message?.includes('родитель')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}