import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function getCategoryTree(parentId: number | null = null) {
  const categories = await prisma.category.findMany({
    where: { parentId },
    include: { children: true },
    orderBy: { name: "asc" },
  });

  // Рекурсия для вложенности
  return await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      children: await getCategoryTree(cat.id),
    }))
  );
}

export async function GET() {
  try {
    const tree = await getCategoryTree(null);
    return NextResponse.json(tree, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    return NextResponse.json({ error: "Не удалось получить дерево категорий" }, { status: 500 });
  }
}
