// app/api/products/route.ts
import { NextResponse } from "next/server";
//import prisma from "@/lib/prisma";
import prisma from "@/app/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/products — создание товара
export async function POST(req: Request) {
  try {
    console.log("=== НАЧАЛО СОЗДАНИЯ ТОВАРА ===");
    
    const formData = await req.formData();
    console.log("FormData получен");

    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : null;

    console.log("Данные товара:", { code, name, description, categoryId });

    // 1. Создаём директорию для картинок
    const uploadDir = path.join(process.cwd(), "public", "img", "products", code);
    console.log("Путь для сохранения:", uploadDir);
    
    try {
      await mkdir(uploadDir, { recursive: true });
      console.log("✅ Директория создана успешно");
    } catch (mkdirError) {
      console.error("❌ Ошибка создания директории:", mkdirError);
      throw new Error(`Не удалось создать директорию: ${mkdirError}`);
    }

    // 2. Создаём продукт
    console.log("Создаем продукт в БД...");
    const product = await prisma.product.create({
      data: { code, name, description, categoryId },
    });
    console.log("✅ Продукт создан с ID:", product.id);

    // 3. Загружаем картинки
    const files = formData.getAll("images") as File[];
    console.log("Получено файлов:", files.length);
    
    const imagePromises = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`Обрабатываем файл ${i + 1}:`, file.name, "размер:", file.size, "тип:", file.type);

      if (file.size === 0) {
        console.warn("⚠️ Пропускаем пустой файл");
        continue;
      }

      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        console.log("Файл прочитан, размер буфера:", buffer.length);

        const filename = i === 0 ? `${code}_main.jpg` : `${code}_${i + 1}.jpg`;
        const filepath = path.join(uploadDir, filename);
        const webPath = `/img/products/${code}/${filename}`;

        console.log("Сохраняем файл по пути:", filepath);

        // Сохраняем файл на диск
        await writeFile(filepath, buffer);
        console.log("✅ Файл успешно сохранен на диск");

        // Создаем запись в БД
        imagePromises.push(
          prisma.productImage.create({
            data: {
              productId: product.id,
              filename,
              path: webPath,
              isMain: i === 0,
            },
          })
        );
        console.log("✅ Запись изображения добавлена в очередь");

      } catch (fileError) {
        console.error("❌ Ошибка при обработке файла:", fileError);
      }
    }

    // Ждем завершения всех загрузок изображений
    if (imagePromises.length > 0) {
      console.log("Сохраняем записи изображений в БД...");
      await Promise.all(imagePromises);
      console.log("✅ Все изображения сохранены в БД");
    } else {
      console.log("⚠️ Нет изображений для сохранения");
    }

    // 4. Получаем продукт с изображениями для ответа
    console.log("Получаем полные данные продукта...");
    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: true,
        category: true,
      },
    });

    console.log("=== ТОВАР УСПЕШНО СОЗДАН ===");
    return NextResponse.json(
      { 
        success: true,
        message: "Товар успешно создан", 
        product: productWithImages,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ КРИТИЧЕСКАЯ ОШИБКА при создании продукта:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Не удалось создать товар",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
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
