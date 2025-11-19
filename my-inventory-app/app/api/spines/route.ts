import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generateSlug } from "@/lib/translit";
import { ProductUnitPhysicalStatus, ProductUnitCardStatus } from "@prisma/client";
import { nodeIndexService } from "@/app/lib/node-index/NodeIndexService";

// GET метод с исправленной фильтрацией по обоим типам статусов
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const includeEmpty = searchParams.get('includeEmpty') !== 'false';

    // Статусы для отображения (оба типа)
    const physicalStatuses: ProductUnitPhysicalStatus[] = [
      'IN_STORE', 
      'IN_DISASSEMBLED',
      'IN_COLLECTED'
    ];

    const cardStatuses: ProductUnitCardStatus[] = [
      'CLEAR', 
      'IN_REQUEST', 
      'IN_DELIVERY', 
      'ARRIVED'
    ];

    // Парсим статус фильтр
    let statusWhereCondition = {};
    if (statusFilter) {
      if (statusFilter.includes(',')) {
        const statuses = statusFilter.split(',').filter(s => s.trim() !== '');
        
        // Разделяем статусы по типам
        const physicalStatusesFilter = statuses.filter(s => 
          Object.values(ProductUnitPhysicalStatus).includes(s as ProductUnitPhysicalStatus)
        );
        const cardStatusesFilter = statuses.filter(s => 
          Object.values(ProductUnitCardStatus).includes(s as ProductUnitCardStatus)
        );

        statusWhereCondition = {
          OR: [
            ...(physicalStatusesFilter.length > 0 ? [{ statusProduct: { in: physicalStatusesFilter } }] : []),
            ...(cardStatusesFilter.length > 0 ? [{ statusCard: { in: cardStatusesFilter } }] : [])
          ]
        };
      } else {
        // Один статус
        if (Object.values(ProductUnitPhysicalStatus).includes(statusFilter as ProductUnitPhysicalStatus)) {
          statusWhereCondition = { statusProduct: statusFilter as ProductUnitPhysicalStatus };
        } else if (Object.values(ProductUnitCardStatus).includes(statusFilter as ProductUnitCardStatus)) {
          statusWhereCondition = { statusCard: statusFilter as ProductUnitCardStatus };
        }
      }
    } else {
      // По умолчанию - оба типа статусов
      statusWhereCondition = {
        OR: [
          { statusProduct: { in: physicalStatuses } },
          { statusCard: { in: cardStatuses } }
        ]
      };
    }

    const spines = await prisma.spine.findMany({
      include: {
        category: true,
        productUnits: {
          where: statusWhereCondition,
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
            some: statusWhereCondition
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
 * POST /api/spines — создание нового Spine с Node Index
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

    // Проверка категории - ОБЯЗАТЕЛЬНА для Spine
    if (!categoryId) {
      return NextResponse.json(
        { ok: false, error: "categoryId обязателен для создания Spine" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { ok: false, error: "Категория не найдена" },
        { status: 404 }
      );
    }

    // Проверяем что категория имеет node_index
    if (!category.node_index) {
      return NextResponse.json(
        { ok: false, error: "Категория не имеет node_index" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    // Генерация slug
    let slug = generateSlug(trimmedName);
    const originalSlug = slug;
    let counter = 1;

    // Проверяем уникальность slug (ГЛОБАЛЬНО)
    while (await prisma.spine.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // Генерируем Node Index и Human Path для Spine
    const indexes = await nodeIndexService.generateSpineIndex(category, slug, trimmedName);

    // Проверяем уникальность node_index
    const existingNodeIndex = await prisma.spine.findUnique({
      where: { node_index: indexes.node_index }
    });

    if (existingNodeIndex) {
      return NextResponse.json(
        { ok: false, error: "Spine с таким node_index уже существует" },
        { status: 409 }
      );
    }

    // Создаем Spine
    const spine = await prisma.spine.create({
      data: {
        name: trimmedName,
        slug,
        categoryId: categoryId,
        imagePath: imagePath || null,
        node_index: indexes.node_index,
        human_path: indexes.human_path,
      },
    });

    console.log("✅ Spine создан с node_index:", {
      id: spine.id,
      name: spine.name,
      node_index: spine.node_index,
      human_path: spine.human_path,
      category: category.name
    });

    return NextResponse.json({
      ok: true,
      message: "Spine успешно создан",
      data: spine,
    });
  } catch (error: any) {
    console.error("Ошибка при создании Spine:", error);

    // Обработка ошибок уникальности
    if (error?.code === "P2002") {
      const target = error.meta?.target;
      if (target?.includes('slug')) {
        return NextResponse.json(
          { ok: false, error: "Spine с таким названием уже существует" },
          { status: 400 }
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
    if (error.message.includes('node_index') || error.message.includes('Категория')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Не удалось создать Spine" },
      { status: 500 }
    );
  }
}