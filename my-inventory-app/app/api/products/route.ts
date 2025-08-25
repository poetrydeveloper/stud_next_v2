// app/api/products/route.ts
import { NextResponse } from "next/server";
//import prisma from "@/lib/prisma";
import prisma from "../../lib/prisma"
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/products — создание товара
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : null;

    // 1. Создаём директорию для картинок
    const uploadDir = path.join(process.cwd(), "public", "img", "products", code);
    await mkdir(uploadDir, { recursive: true });

    // 2. Создаём продукт
    const product = await prisma.product.create({
      data: { code, name, description, categoryId },
    });

    // 3. Загружаем картинки
    const files = formData.getAll("images") as File[];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = i === 0 ? `${code}_main.jpg` : `${code}_${i + 1}.jpg`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);

      await prisma.productImage.create({
        data: {
          productId: product.id,
          filename,
          path: `/img/products/${code}/${filename}`,
          isMain: i === 0,
        },
      });
    }

    return NextResponse.json({ message: "Товар успешно создан", product }, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании продукта:", error);
    return NextResponse.json({ error: "Не удалось создать товар" }, { status: 500 });
  }
}

// GET /api/products — список товаров
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    return NextResponse.json({ error: "Не удалось получить товары" }, { status: 500 });
  }
}
