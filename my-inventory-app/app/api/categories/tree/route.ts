// app/api/categories/tree/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET — Получить дерево категорий (для Miller Columns)
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parent_id: null // Только корневые категории
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                spines: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    _count: {
                      select: {
                        products: true,
                        productUnits: true
                      }
                    }
                  }
                }
              }
            },
            spines: {
              select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                  select: {
                    products: true,
                    productUnits: true
                  }
                }
              }
            }
          }
        },
        spines: {
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: {
                products: true,
                productUnits: true
              }
            }
          }
        }
      },
      orderBy: { node_index: "asc" }
    });

    return NextResponse.json({
      ok: true,
      data: categories,
    });
  } catch (error) {
    console.error("Ошибка при получении дерева категорий:", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось получить дерево категорий" },
      { status: 500 }
    );
  }
}