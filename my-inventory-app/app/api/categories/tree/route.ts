// app/api/categories/tree/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * GET — возвращает дерево категорий для селекторов
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        path: true, // Используем path вместо parentId
      },
      orderBy: { path: "asc" },
    });

    // Функция для построения дерева из path
    const buildTree = (categories: any[]) => {
      const tree: any[] = [];
      const map = new Map();
      
      categories.forEach(cat => {
        map.set(cat.id, { ...cat, children: [] });
      });
      
      categories.forEach(cat => {
        if (cat.path === '/') {
          tree.push(map.get(cat.id));
        } else {
          const pathParts = cat.path.split('/').filter(Boolean);
          const parentId = parseInt(pathParts[pathParts.length - 2]);
          const parent = map.get(parentId);
          if (parent) {
            parent.children.push(map.get(cat.id));
          }
        }
      });
      
      return tree;
    };

    const categoryTree = buildTree(categories);

    return NextResponse.json({
      ok: true,
      data: categoryTree,
    });
  } catch (error: any) {
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