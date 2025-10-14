// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generateSlug } from "@/app/lib/translit";

/**
 * GET /api/categories/[id] - получить категорию по ID
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = Number(params.id);
    
    console.log("🔍 Запрос категории ID:", categoryId);

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
      // Убираем include так как отношения children нет в схеме
    });

    console.log("📊 Найдена категория:", category);

    if (!category) {
      return NextResponse.json(
        { ok: false, error: "Категория не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: category
    });

  } catch (error) {
    console.error("GET /api/categories/[id] error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/categories/[id] - обновить категорию
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = Number(params.id);
    const { name, parentId } = await req.json();

    console.log("🔍 Обновление категории ID:", categoryId, { name, parentId });

    // Валидация
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Некорректное имя категории" },
        { status: 400 }
      );
    }

    // Проверяем существование категории
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { ok: false, error: "Категория не найдена" },
        { status: 404 }
      );
    }

    const trimmedName = name.trim();

    // Если имя не изменилось, используем старый slug
    let slug = existingCategory.slug;
    if (trimmedName !== existingCategory.name) {
      slug = generateSlug(trimmedName);
      
      // Проверяем уникальность нового slug
      const existingSlug = await prisma.category.findUnique({
        where: { slug }
      });

      if (existingSlug && existingSlug.id !== categoryId) {
        let counter = 1;
        let newSlug = slug;
        while (await prisma.category.findUnique({ where: { slug: newSlug } })) {
          newSlug = `${slug}-${counter}`;
          counter++;
        }
        slug = newSlug;
      }
    }

    // Определяем новый path
    let newPath = `/${slug}`;
    
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
      newPath = `${parent.path}/${slug}`;
    }

    // Проверяем уникальность нового path
    const existingPath = await prisma.category.findUnique({
      where: { path: newPath }
    });

    if (existingPath && existingPath.id !== categoryId) {
      return NextResponse.json(
        { ok: false, error: "Категория с таким путем уже существует" },
        { status: 409 }
      );
    }

    // Обновляем категорию
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: trimmedName,
        slug,
        path: newPath
      }
    });

    console.log("✅ Категория обновлена:", updatedCategory);

    return NextResponse.json({
      ok: true,
      data: updatedCategory,
      message: "Категория успешно обновлена"
    });

  } catch (error: any) {
    console.error("PATCH /api/categories/[id] error:", error);
    
    if (error?.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "Категория с таким названием или путем уже существует" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id] - удалить категорию
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = Number(params.id);

    console.log("🗑️ Удаление категории ID:", categoryId);

    // Проверяем есть ли дочерние категории (ищем по path)
    const children = await prisma.category.findMany({
      where: { 
        path: { 
          startsWith: `/${categoryId}/` 
        } 
      }
    });

    if (children.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Нельзя удалить категорию с дочерними элементами" },
        { status: 400 }
      );
    }

    // Проверяем есть ли связанные продукты
    const products = await prisma.product.findMany({
      where: { categoryId }
    });

    if (products.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Нельзя удалить категорию с привязанными товарами" },
        { status: 400 }
      );
    }

    // Удаляем категорию
    await prisma.category.delete({
      where: { id: categoryId }
    });

    console.log("✅ Категория удалена ID:", categoryId);

    return NextResponse.json({
      ok: true,
      message: "Категория успешно удалена"
    });

  } catch (error: any) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}