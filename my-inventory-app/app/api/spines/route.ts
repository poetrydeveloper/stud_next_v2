// app/api/spines/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generateSlug } from "@/app/lib/translit";
import { ProductUnitPhysicalStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') as ProductUnitPhysicalStatus | null;
    const categoryId = searchParams.get('categoryId');
    const includeEmpty = searchParams.get('includeEmpty') !== 'false'; // по умолчанию true

    const spines = await prisma.spine.findMany({
      include: {
        category: true,
        productUnits: {
          where: statusFilter ? {
            statusProduct: statusFilter
          } : {},
          include: {
            product: {
              select: {
                name: true,
                code: true,
                brand: { 
                  select: { 
                    id: true,
                    name: true 
                  } 
                },
                images: { 
                  where: { isMain: true },
                  take: 1 
                }
              },
            },
            customer: {
              select: {
                name: true,
                phone: true
              }
            },
            logs: { 
              take: 5, 
              orderBy: { createdAt: 'desc' } 
            },
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { productUnits: true },
        },
      },
      where: {
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(!includeEmpty && {
          productUnits: {
            some: statusFilter ? { statusProduct: statusFilter } : {}
          }
        })
      },
      orderBy: { name: "asc" },
    });

    // Обогащаем данные brandData для обратной совместимости
    const enrichedSpines = spines.map(spine => {
      const brandData: Record<string, any> = {};
      
      spine.productUnits.forEach(unit => {
        const brandName = unit.product?.brand?.name || 'Без бренда';
        if (!brandData[brandName]) {
          brandData[brandName] = {
            count: 0,
            units: []
          };
        }
        brandData[brandName].count++;
        brandData[brandName].units.push(unit);
      });

      return {
        ...spine,
        brandData
      };
    });

    return NextResponse.json({ 
      ok: true, 
      spines: enrichedSpines,
      filters: {
        status: statusFilter,
        categoryId: categoryId ? parseInt(categoryId) : null
      }
    });
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