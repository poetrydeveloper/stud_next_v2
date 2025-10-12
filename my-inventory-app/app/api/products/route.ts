// app/api/products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string | null;
    const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : null;
    const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : null;
    const spineId = formData.get("spineId") ? Number(formData.get("spineId")) : null;

    if (!name || !code) {
      return NextResponse.json({ ok: false, error: "Name and code are required" }, { status: 400 });
    }

    console.log("📥 Получены данные:", { name, code, description, categoryId, brandId, spineId });

    // Создаем продукт
    const product = await prisma.product.create({
      data: { name, code, description, categoryId, brandId, spineId },
    });

    console.log("✅ Продукт создан в БД:", product.id);

    // Загружаем изображения если есть
    const files = formData.getAll("images") as File[];
    if (files.length > 0 && files[0].size > 0) {
      console.log("🖼️ Начало загрузки изображений:", files.length);
      await handleImageUpload(formData, code, product.id);
    }

    // Получаем продукт с изображениями
    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: true, category: true, brand: true, spine: true },
    });

    return NextResponse.json({ ok: true, data: productWithImages }, { status: 201 });
  } catch (err: any) {
    console.error("❌ POST /api/products error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// Вспомогательная функция для загрузки изображений
async function handleImageUpload(formData: FormData, code: string, productId: number) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "img", "products", code);
    await mkdir(uploadDir, { recursive: true });

    const files = formData.getAll("images") as File[];
    
    let mainImageExists = await prisma.productImage.findFirst({ 
      where: { productId, isMain: true } 
    });

    const promises: Promise<any>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${code}_${Date.now()}_${i + 1}.jpg`;
      const filepath = path.join(uploadDir, filename);
      const webPath = `/img/products/${code}/${filename}`;
      
      await writeFile(filepath, buffer);

      const isMain = !mainImageExists && i === 0;

      promises.push(
        prisma.productImage.create({
          data: { productId, filename, path: webPath, isMain },
        })
      );

      if (isMain) mainImageExists = true;
    }

    await Promise.all(promises);
    console.log("✅ Изображения загружены");
  } catch (error) {
    console.error("❌ Ошибка загрузки изображений:", error);
    throw error;
  }
}