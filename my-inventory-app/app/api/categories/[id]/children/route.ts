// app/api/categories/[id]/children/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET — Получить дочерние элементы категории (категории + spines)
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);

    // Получаем дочерние категории
    const childCategories = await prisma.category.findMany({
      where: {
        parent_id: categoryId
      },
      select: {
        id: true,
        name: true,
        slug: true,
        path: true,
        node_index: true,
        human_path: true,
        _count: {
          select: {
            children: true,
            products: true,
            spines: true
          }
        }
      },
      orderBy: { node_index: "asc" }
    });

    // Получаем spines этой категории
    const spines = await prisma.spine.findMany({
      where: {
        categoryId: categoryId
      },
      select: {
        id: true,
        name: true,
        slug: true,
        node_index: true,
        human_path: true,
        imagePath: true,
        _count: {
          select: {
            products: true,
            productUnits: true
          }
        },
        products: {
          select: {
            id: true,
            code: true,
            name: true,
            brand: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          },
          take: 3
        }
      },
      orderBy: { node_index: "asc" }
    });

    return NextResponse.json({
      ok: true,
      data: {
        categories: childCategories,
        spines: spines
      }
    });

  } catch (error) {
    console.error("Ошибка при получении дочерних элементов:", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось получить дочерние элементы" },
      { status: 500 }
    );
  }
}