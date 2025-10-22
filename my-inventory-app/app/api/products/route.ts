// app/api/products/route.tsimport { NextResponse } from "next/server";
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
      return NextResponse.json(
        { ok: false, error: "Name and code are required" }, 
        { status: 400 }
      );
    }

    console.log("📥 Получены данные:", { name, code, description, categoryId, brandId, spineId });

    // === ПРОВЕРКА SPINE ===
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

    if (!spine.node_index) {
      return NextResponse.json(
        { ok: false, error: "Spine не имеет node_index" },
        { status: 400 }
      );
    }

    // Проверяем уникальность кода продукта
    const existingProduct = await prisma.product.findUnique({
      where: { code }
    });

    if (existingProduct) {
      return NextResponse.json(
        { ok: false, error: "Продукт с таким кодом уже существует" },
        { status: 409 }
      );
    }

    // === ГЕНЕРАЦИЯ NODE INDEX ===
    const node_index = `${spine.node_index}_P[${code}]`;
    const human_path = `${spine.human_path} / ${name}`;

    console.log("🔧 Сгенерированные индексы:", { node_index, human_path });

    // Проверяем уникальность node_index
    const existingNodeIndex = await prisma.product.findUnique({
      where: { node_index }
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
        node_index: node_index,
        human_path: human_path,
      },
    });

    console.log("✅ Продукт создан в БД:", { 
      id: product.id, 
      name: product.name,
      code: product.code,
      node_index: product.node_index,
      human_path: product.human_path
    });

    // === СОЗДАЕМ JSON ФАЙЛ СТРУКТУРЫ ===
    try {
      await createProductJsonFile(product, spine, null, spine.category);
      console.log("✅ JSON файл структуры создан");
    } catch (error) {
      console.error("⚠️ Ошибка создания JSON файла (продолжаем):", error);
    }

    // === ЗАГРУЗКА ИЗОБРАЖЕНИЙ ===
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
        message: "Продукт успешно создан"
      }, 
      { status: 201 }
    );

  } catch (err: any) {
    console.error("❌ POST /api/products error:", err);

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
          { ok: false, error: "Продукт с таким node_index уже существует" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { ok: false, error: err.message }, 
      { status: 500 }
    );
  }
}

// === НОВАЯ ФУНКЦИЯ: СОЗДАНИЕ JSON ФАЙЛА ===
async function createProductJsonFile(product: any, spine: any, brand: any, category: any) {
  try {
    const jsonData = {
      code: product.code,
      name: product.name,
      description: product.description || '',
      brand: brand ? {
        id: brand.id,
        name: brand.name,
        slug: brand.slug
      } : null,
      category: category ? {
        id: category.id,
        name: category.name,
        node_index: category.node_index,
        human_path: category.human_path
      } : null,
      spine: spine ? {
        id: spine.id,
        name: spine.name,
        node_index: spine.node_index,
        human_path: spine.human_path
      } : null,
      node_index: product.node_index,
      created_at: new Date().toISOString()
    };

    // Создаем путь к JSON файлу
    const productSlug = `p_${product.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const parentPath = spine.node_index.replace('structure/', '');
    const jsonFilePath = path.join(process.cwd(), 'public', 'structure', parentPath, `${productSlug}.json`);
    
    // Убеждаемся что директория существует
    await mkdir(path.dirname(jsonFilePath), { recursive: true });
    
    // Создаем JSON файл
    await writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
    
    console.log("✅ JSON файл создан:", jsonFilePath);
  } catch (error) {
    console.error("❌ Ошибка создания JSON файла:", error);
    throw error; // Пробрасываем ошибку дальше
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