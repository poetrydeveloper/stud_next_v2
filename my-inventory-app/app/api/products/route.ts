// // app/api/products/route.ts

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nodeIndexService } from "@/app/lib/node-index/NodeIndexService";

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
      return NextResponse.json(
        { ok: false, error: "Name and code are required" }, 
        { status: 400 }
      );
    }

    console.log("📥 Получены данные:", { name, code, description, categoryId, brandId, spineId });

    // === ПРОВЕРКА SPINE (обязателен для Product) ===
    if (!spineId) {
      return NextResponse.json(
        { ok: false, error: "spineId обязателен для создания Product" },
        { status: 400 }
      );
    }

    const spine = await prisma.spine.findUnique({
      where: { id: spineId },
      include: { category: true }
    });

    if (!spine) {
      return NextResponse.json(
        { ok: false, error: "Spine не найден" },
        { status: 404 }
      );
    }

    // Проверяем что spine имеет node_index
    if (!spine.node_index) {
      return NextResponse.json(
        { ok: false, error: "Spine не имеет node_index" },
        { status: 400 }
      );
    }

    // Проверяем уникальность кода продукта (ГЛОБАЛЬНО)
    const existingProduct = await prisma.product.findUnique({
      where: { code }
    });

    if (existingProduct) {
      return NextResponse.json(
        { ok: false, error: "Продукт с таким кодом уже существует" },
        { status: 409 }
      );
    }

    // === ГЕНЕРАЦИЯ NODE INDEX И HUMAN PATH ===
    const indexes = await nodeIndexService.generateProductIndex(spine, code, name);

    // Проверяем уникальность node_index
    const existingNodeIndex = await prisma.product.findUnique({
      where: { node_index: indexes.node_index }
    });

    if (existingNodeIndex) {
      return NextResponse.json(
        { ok: false, error: "Продукт с таким node_index уже существует" },
        { status: 409 }
      );
    }

    // === СОЗДАЕМ ПРОДУКТ ===
    const product = await prisma.product.create({
      data: {
        name,
        code,
        description,
        categoryId,
        brandId,
        spineId,
        node_index: indexes.node_index,
        human_path: indexes.human_path,
      },
    });

    console.log("✅ Продукт создан в БД:", { 
      id: product.id, 
      name: product.name,
      code: product.code,
      node_index: product.node_index,
      human_path: product.human_path
    });

    // === ЗАГРУЗКА ИЗОБРАЖЕНИЙ (если есть) ===
    const files = formData.getAll("images") as File[];
    if (files.length > 0 && files[0].size > 0) {
      console.log("🖼️ Начало загрузки изображений:", files.length);
      await handleImageUpload(formData, code, product.id);
    }

    // === ПОЛУЧАЕМ ПРОДУКТ С ИЗОБРАЖЕНИЯМИ ===
    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: true,
        category: true,
        brand: true,
        spine: true,
      },
    });

    return NextResponse.json(
      { 
        ok: true, 
        data: productWithImages,
        message: "Продукт успешно создан с Node Index системой"
      }, 
      { status: 201 }
    );

  } catch (err: any) {
    console.error("❌ POST /api/products error:", err);

    // Обработка ошибок уникальности
    if (err?.code === "P2002") {
      const target = err.meta?.target;
      if (target?.includes('code')) {
        return NextResponse.json(
          { ok: false, error: "Продукт с таким кодом уже существует" },
          { status: 409 }
        );
      }
      if (target?.includes('node_index')) {
        return NextResponse.json(
          { ok: false, error: "Конфликт node_index" },
          { status: 409 }
        );
      }
    }

    // Обработка ошибок из NodeIndexService
    if (err.message.includes('node_index') || err.message.includes('Spine')) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: err.message }, 
      { status: 500 }
    );
  }
}

// Вспомогательная функция для загрузки изображений (без изменений)
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
          data: {
            productId,
            filename,
            path: webPath,
            isMain,
          },
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