// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

/**
 * GET — получить один продукт с категориями, брендом и изображениями
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, brand: true, images: true },
  });
  if (!product) return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: product });
}

/**
 * PATCH — редактировать продукт + работа с изображениями
 * body: FormData с полями name?, code?, description?, categoryId?, brandId?, images?, deleteImages?
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const formData = await req.formData();

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
          try { await unlink(path.join(process.cwd(), "public", image.path)); } catch {}
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

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: { category: true, brand: true, images: true },
    });

    return NextResponse.json({ ok: true, data: updatedProduct });
  } catch (err: any) {
    console.error("PATCH /api/products/[id] error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE — запрещаем удаление
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ ok: false, error: "Deleting products is not allowed" }, { status: 403 });
}

/**
 * Вспомогательная функция для загрузки изображений
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
