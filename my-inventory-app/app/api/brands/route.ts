import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import slugify from "slugify";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Название бренда обязательно" },
        { status: 400 }
      );
    }

    // Проверяем, существует ли бренд с таким именем
    const existingBrand = await prisma.brand.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: `Бренд "${name}" уже существует` },
        { status: 409 }
      );
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: "ru"
    }).replace(/[^\w-]+/g, "");

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json({ 
      ok: true, 
      data: brand 
    }, { status: 201 });
  } catch (error: any) {
    console.error("Ошибка при создании бренда:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Бренд с таким названием уже существует" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// ДОБАВЛЯЕМ GET МЕТОД ДЛЯ ПОЛУЧЕНИЯ БРЕНДОВ
export async function GET() {
  try {
    console.log("🔍 GET /api/brands - fetching brands");
    
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: 'asc',
      }
    });

    console.log("✅ Found brands:", brands.length);
    
    return NextResponse.json({ 
      ok: true, 
      data: brands 
    });
  } catch (error: any) {
    console.error("❌ Error fetching brands:", error);
    return NextResponse.json(
      { ok: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}