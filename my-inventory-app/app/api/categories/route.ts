//app/api/categories/route.ts

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// GET - получить все категории (плоский список)
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true
      }
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    return NextResponse.json(
      { error: "Не удалось получить категории" },
      { status: 500 }
    );
  }
}

// POST - создать новую категорию (существующий код без изменений)
export async function POST(req: Request) {
  try {
    const { name, parentId } = await req.json();

    function generateSlug(name: string): string {
      console.log(`name на входе = ${name}`);
      
      // Словарь для транслитерации русских букв
      const translitMap: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };

      return name
        .toLowerCase()
        // Транслитерируем русские буквы
        .split('')
        .map(char => translitMap[char] || char)
        .join('')
        // Удаляем цифры и все не-латинские символы (кроме дефиса)
        .replace(/[^a-z-]+/g, '-')
        // Удаляем дефисы в начале и конце
        .replace(/^-+|-+$/g, '')
        // Удаляем повторяющиеся дефисы
        .replace(/-+/g, '-');
    }

    // Валидация
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: "Некорректное имя категории" },
        { status: 400 }
      );
    }

    if (parentId && typeof parentId !== 'number') {
      return NextResponse.json(
        { error: "Некорректный parentId" },
        { status: 400 }
      );
    }

    // Генерация уникального slug
    let slug = generateSlug(name);
    const originalSlug = slug;
    let counter = 1;

    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // Проверка существования родительской категории
    if (parentId) {
      const parentExists = await prisma.category.findUnique({
        where: { id: parentId }
      });
      
      if (!parentExists) {
        return NextResponse.json(
          { error: "Родительская категория не найдена" },
          { status: 404 }
        );
      }
    }

    // Создание категории
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(category, { status: 201 });

  } catch (error) {
    console.error("Ошибка при создании категории:", error);
    
    // Type assertion
    const prismaError = error as { code?: string };
    
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        { error: "Категория с таким slug уже существует" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
