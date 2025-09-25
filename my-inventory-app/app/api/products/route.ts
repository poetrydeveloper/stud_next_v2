// app/api/products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

/**
 * GET — список продуктов с категориями, брендами и изображениями
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
        images: true,
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ ok: true, data: products });
  } catch (err: any) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST — создание нового продукта с изображениями
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string | null;
    const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : null;
    const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : null;

    if (!name || !code) {
      return NextResponse.json({ ok: false, error: "Name and code are required" }, { status: 400 });
    }

    // 1. Создаем продукт
    const product = await prisma.product.create({
      data: { name, code, description, categoryId, brandId },
    });

    // 2. Загружаем изображения
    await handleImageUpload(formData, code, product.id);

    // 3. Получаем продукт с изображениями
    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: true, category: true, brand: true },
    });

    return NextResponse.json({ ok: true, data: productWithImages }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/**
 * PUT — обновление продукта с возможностью удаления и добавления изображений
 */
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const id = Number(formData.get("id"));
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string | null;
    const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : null;
    const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : null;
    const deleteImages = (formData.get("deleteImages") as string) || "";

    const currentProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!currentProduct) return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });

    // Удаляем отмеченные изображения
    if (deleteImages) {
      const imagesToDelete = deleteImages.split(",").map(Number);
      for (const imageId of imagesToDelete) {
        const image = await prisma.productImage.findUnique({ where: { id: imageId } });
        if (image) {
          try {
            await unlink(path.join(process.cwd(), "public", image.path));
          } catch {}
          await prisma.productImage.delete({ where: { id: imageId } });
        }
      }
    }

    // Обновляем продукт
    await prisma.product.update({
      where: { id },
      data: { name, code, description, categoryId, brandId },
    });

    // Загружаем новые изображения
    const files = formData.getAll("images") as File[];
    if (files.length > 0 && files[0].size > 0) {
      await handleImageUpload(formData, code, id);
    }

    const productWithImages = await prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true, brand: true },
    });

    return NextResponse.json({ ok: true, data: productWithImages });
  } catch (err: any) {
    console.error("PUT /api/products error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/**
 * Вспомогательная функция для загрузки изображений на диск и сохранения в БД
 */
async function handleImageUpload(formData: FormData, code: string, productId: number) {
  const uploadDir = path.join(process.cwd(), "public", "img", "products", code);
  await mkdir(uploadDir, { recursive: true });

  const files = formData.getAll("images") as File[];
  if (!files.length) return;

  let mainImageExists = await prisma.productImage.findFirst({ where: { productId, isMain: true } });
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
}
