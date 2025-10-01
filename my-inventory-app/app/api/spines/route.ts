// app/api/spines/route.ts (добавляем POST)
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generateSlug } from "@/app/lib/translit";

export async function GET() {
  try {
    const spines = await prisma.spine.findMany({
      include: {
        category: true,
        productUnits: {
          include: {
            product: {
              select: {
                brand: { select: { name: true } },
              },
            },
            logs: true,
          },
        },
        _count: {
          select: { productUnits: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ ok: true, spines });
  } catch (err: any) {
    console.error("💥 Ошибка API /spines:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}


/**
 * POST /api/spines — создание нового Spine
 * body: { name: string, categoryId?: number, imagePath?: string }
 */
export async function POST(req: Request) {
  try {
    const { name, categoryId, imagePath } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { ok: false, error: "Название Spine обязательно" },
        { status: 400 }
      );
    }

    // Генерация slug
    let slug = generateSlug(name.trim());
    const originalSlug = slug;
    let counter = 1;

    while (await prisma.spine.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // Проверка категории если указана
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        return NextResponse.json(
          { ok: false, error: "Категория не найдена" },
          { status: 404 }
        );
      }
    }

    const spine = await prisma.spine.create({
      data: {
        name: name.trim(),
        slug,
        categoryId: categoryId || null,
        imagePath: imagePath || null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Spine успешно создан",
      data: spine,
    });
  } catch (error: any) {
    console.error("Ошибка при создании Spine:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "Spine с таким названием уже существует" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Не удалось создать Spine" },
      { status: 500 }
    );
  }
}