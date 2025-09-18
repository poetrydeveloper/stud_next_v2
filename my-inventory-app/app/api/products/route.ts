// app/api/products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
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
    const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : null;
    console.log("Данные товара:", { code, name, description, categoryId, brandId });

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
      data: { code, name, description, categoryId, brandId },
    });
    console.log("✅ Продукт создан с ID:", product.id);

    // 3. Загружаем картинки
    await handleImageUpload(formData, code, product.id);

    // 4. Получаем продукт с изображениями для ответа
    console.log("Получаем полные данные продукта...");
    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: true,
        category: true,
        brand: true,
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
        brand: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    return NextResponse.json({ error: "Не удалось получить товары" }, { status: 500 });
  }
}

// PUT /api/products — обновление товара
export async function PUT(req: Request) {
  try {
    console.log("=== НАЧАЛО ОБНОВЛЕНИЯ ТОВАРА ===");
    
    const formData = await req.formData();
    console.log("FormData получен");

    const id = Number(formData.get("id"));
    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : null;
    const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : null;
    const deleteImages = formData.get("deleteImages") as string;

    console.log("Данные товара для обновления:", { id, code, name, description, categoryId, brandId });

    // 1. Получаем текущий товар
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true }
    });

    if (!currentProduct) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }

    // 2. Удаляем отмеченные изображения
    if (deleteImages) {
      const imagesToDelete = deleteImages.split(',').map(id => parseInt(id));
      console.log("Удаляем изображения:", imagesToDelete);

      for (const imageId of imagesToDelete) {
        const image = await prisma.productImage.findUnique({
          where: { id: imageId }
        });

        if (image) {
          // Удаляем файл с диска
          const filePath = path.join(process.cwd(), 'public', image.path);
          try {
            await unlink(filePath);
            console.log("✅ Файл удален с диска:", filePath);
          } catch (error) {
            console.warn("⚠️ Не удалось удалить файл:", filePath);
          }

          // Удаляем запись из БД
          await prisma.productImage.delete({
            where: { id: imageId }
          });
          console.log("✅ Изображение удалено из БД:", imageId);
        }
      }
    }

    // 3. Обновляем данные товара
    console.log("Обновляем продукт в БД...");
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { 
        code, 
        name, 
        description, 
        categoryId, 
        brandId 
      },
    });
    console.log("✅ Продукт обновлен");

    // 4. Загружаем новые картинки, если есть
    const files = formData.getAll("images") as File[];
    if (files.length > 0 && files[0].size > 0) {
      console.log("Загружаем новые изображения...");
      await handleImageUpload(formData, code, id);
    }

    // 5. Получаем обновленный товар с изображениями
    console.log("Получаем обновленные данные продукта...");
    const productWithImages = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        brand: true,
      },
    });

    console.log("=== ТОВАР УСПЕШНО ОБНОВЛЕН ===");
    return NextResponse.json(
      { 
        success: true,
        message: "Товар успешно обновлен", 
        product: productWithImages,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ КРИТИЧЕСКАЯ ОШИБКА при обновлении продукта:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Не удалось обновить товар",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Вспомогательная функция для загрузки изображений
async function handleImageUpload(formData: FormData, code: string, productId: number) {
  const uploadDir = path.join(process.cwd(), "public", "img", "products", code);
  
  try {
    await mkdir(uploadDir, { recursive: true });
    console.log("✅ Директория создана/проверена:", uploadDir);
  } catch (mkdirError) {
    console.error("❌ Ошибка создания директории:", mkdirError);
    throw new Error(`Не удалось создать директорию: ${mkdirError}`);
  }

  const files = formData.getAll("images") as File[];
  console.log("Получено файлов для загрузки:", files.length);
  
  const imagePromises = [];
  let mainImageExists = await prisma.productImage.findFirst({
    where: { productId, isMain: true }
  });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Обрабатываем файл ${i + 1}:`, file.name, "размер:", file.size);

    if (file.size === 0) {
      console.warn("⚠️ Пропускаем пустой файл");
      continue;
    }

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      console.log("Файл прочитан, размер буфера:", buffer.length);

      const timestamp = Date.now();
      const filename = `${code}_${timestamp}_${i + 1}.jpg`;
      const filepath = path.join(uploadDir, filename);
      const webPath = `/img/products/${code}/${filename}`;

      console.log("Сохраняем файл по пути:", filepath);

      // Сохраняем файл на диск
      await writeFile(filepath, buffer);
      console.log("✅ Файл успешно сохранен на диск");

      // Определяем, является ли это главным изображением
      const isMain = !mainImageExists && i === 0;

      // Создаем запись в БД
      imagePromises.push(
        prisma.productImage.create({
          data: {
            productId,
            filename,
            path: webPath,
            isMain,
          },
        })
      );

      if (isMain) {
        mainImageExists = true;
      }

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
}