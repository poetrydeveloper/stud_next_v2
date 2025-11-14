// app/api/categories/tree/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        path: true,
      },
      orderBy: { path: "asc" },
    });

    // ИСПРАВЛЕННАЯ функция построения дерева
    const buildTree = (categories: any[]) => {
      const tree: any[] = [];
      const map = new Map();
      
      // Создаем узлы
      categories.forEach(cat => {
        map.set(cat.id, { ...cat, children: [] });
      });
      
      // Строим иерархию
      categories.forEach(cat => {
        const pathParts = cat.path.split('/').filter(Boolean);
        
        if (pathParts.length === 1) {
          // Корневая категория (путь типа "/1/")
          tree.push(map.get(cat.id));
        } else {
          // Дочерняя категория (путь типа "/1/2/")
          const parentId = parseInt(pathParts[pathParts.length - 2]);
          const parent = map.get(parentId);
          if (parent) {
            parent.children.push(map.get(cat.id));
          } else {
            // Если родитель не найден, добавляем в корень
            tree.push(map.get(cat.id));
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
        error: "Не удалось получить дерево категорий",
      },
      { status: 500 }
    );
  }
}