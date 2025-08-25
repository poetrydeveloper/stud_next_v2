import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, slug, parentId } = await req.json();

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании категории:", error);
    return NextResponse.json({ error: "Не удалось создать категорию" }, { status: 500 });
  }
}
