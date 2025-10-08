// app/api/products/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/app/lib/prisma";
// import { writeFile, mkdir, unlink } from "fs/promises";
// import path from "path";

// /**
//  * GET — список продуктов с категориями, брендами, spine и изображениями
//  */
// export async function GET() {
//   try {
//     const products = await prisma.product.findMany({
//       include: {
//         category: { select: { name: true } },
//         brand: { select: { name: true } },
//         spine: { select: { id: true, name: true } },
//         images: true,
//       },
//       orderBy: { name: "asc" },
//     });
//     return NextResponse.json({ ok: true, data: products });
//   } catch (err: any) {
//     console.error("GET /api/products error:", err);
//     return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
//   }
// }

// /**
//  * POST — создание нового продукта с spine и изображениями
//  */
// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();

//     const name = formData.get("name") as string;
//     const code = formData.get("code") as string;
//     const description = formData.get("description") as string | null;
//     const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : null;
//     const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : null;
//     const spineId = formData.get("spineId") ? Number(formData.get("spineId")) : null;

//     if (!name || !code) {
//       return NextResponse.json({ ok: false, error: "Name and code are required" }, { status: 400 });
//     }

//     // Создаем продукт
//     const product = await prisma.product.create({
//       data: { name, code, description, categoryId, brandId, spineId },
//     });

//     // Загружаем изображения
//     await handleImageUpload(formData, code, product.id);

//     // Получаем продукт с spine, категориями, брендом и изображениями
//     const productWithImages = await prisma.product.findUnique({
//       where: { id: product.id },
//       include: { images: true, category: true, brand: true, spine: true },
//     });

//     return NextResponse.json({ ok: true, data: productWithImages }, { status: 201 });
//   } catch (err: any) {
//     console.error("POST /api/products error:", err);
//     return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
//   }
// }

// /**
//  * PUT — обновление продукта с spine и изображениями
//  */
// export async function PUT(req: Request) {
//   try {
//     const formData = await req.formData();

//     const id = Number(formData.get("id"));
//     const name = formData.get("name") as string;
//     const code = formData.get("code") as string;
//     const description = formData.get("description") as string | null;
//     const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : null;
//     const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : null;
//     const spineId = formData.get("spineId") ? Number(formData.get("spineId")) : null;
//     const deleteImages = (formData.get("deleteImages") as string) || "";

//     const currentProduct = await prisma.product.findUnique({
//       where: { id },
//       include: { images: true },
//     });
//     if (!currentProduct) return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });

//     // Удаляем отмеченные изображения
//     if (deleteImages) {
//       const imagesToDelete = deleteImages.split(",").map(Number);
//       for (const imageId of imagesToDelete) {
//         const image = await prisma.productImage.findUnique({ where: { id: imageId } });
//         if (image) {
//           try { await unlink(path.join(process.cwd(), "public", image.path)); } catch {}
//           await prisma.productImage.delete({ where: { id: imageId } });
//         }
//       }
//     }

//     // Обновляем продукт
//     await prisma.product.update({
//       where: { id },
//       data: { name, code, description, categoryId, brandId, spineId },
//     });

//     // Загружаем новые изображения
//     const files = formData.getAll("images") as File[];
//     if (files.length > 0 && files[0].size > 0) {
//       await handleImageUpload(formData, code, id);
//     }

//     const productWithImages = await prisma.product.findUnique({
//       where: { id },
//       include: { images: true, category: true, brand: true, spine: true },
//     });

//     return NextResponse.json({ ok: true, data: productWithImages });
//   } catch (err: any) {
//     console.error("PUT /api/products error:", err);
//     return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
//   }
// }

// /**
//  * Вспомогательная функция для загрузки изображений на диск и сохранения в БД
//  */
// async function handleImageUpload(formData: FormData, code: string, productId: number) {
//   const uploadDir = path.join(process.cwd(), "public", "img", "products", code);
//   await mkdir(uploadDir, { recursive: true });

//   const files = formData.getAll("images") as File[];
//   if (!files.length) return;

//   let mainImageExists = await prisma.productImage.findFirst({ where: { productId, isMain: true } });
//   const promises: Promise<any>[] = [];

//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     if (file.size === 0) continue;

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const filename = `${code}_${Date.now()}_${i + 1}.jpg`;
//     const filepath = path.join(uploadDir, filename);
//     const webPath = `/img/products/${code}/${filename}`;
//     await writeFile(filepath, buffer);

//     const isMain = !mainImageExists && i === 0;

//     promises.push(
//       prisma.productImage.create({
//         data: { productId, filename, path: webPath, isMain },
//       })
//     );

//     if (isMain) mainImageExists = true;
//   }

//   await Promise.all(promises);
// }

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { FileStorageAdapter } from "@/app/lib/file-storage-adapter";

/**
 * GET — список продуктов
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
        spine: { select: { id: true, name: true } },
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
 * POST — создание продукта с новой системой хранения
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const storageAdapter = new FileStorageAdapter();

    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string | null;
    const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : null;
    const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : null;
    const spineId = formData.get("spineId") ? Number(formData.get("spineId")) : null;

    if (!name || !code) {
      return NextResponse.json({ ok: false, error: "Name and code are required" }, { status: 400 });
    }

    // Создаем продукт
    const product = await prisma.product.create({
      data: { name, code, description, categoryId, brandId, spineId },
    });

    // Загружаем изображения через новую систему
    const files = formData.getAll("images") as File[];
    if (files.length > 0 && files[0].size > 0) {
      const mainImageExists = await prisma.productImage.findFirst({ 
        where: { productId: product.id, isMain: true } 
      });

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size === 0) continue;

        // Валидация формата
        if (!storageAdapter.isImageFormatSupported(file)) {
          return NextResponse.json({ 
            ok: false, 
            error: "Неподдерживаемый формат изображения. Используйте JPEG, PNG, WebP или GIF" 
          }, { status: 400 });
        }

        // Валидация размера
        if (!storageAdapter.validateFileSize(file)) {
          return NextResponse.json({ 
            ok: false, 
            error: "Размер файла слишком большой. Максимум 10MB" 
          }, { status: 400 });
        }

        try {
          const imageData = await storageAdapter.uploadProductImage(file, product.id, code);
          const isMain = !mainImageExists && i === 0;

          // Сохраняем в БД
          await prisma.productImage.create({
            data: {
              productId: product.id,
              filename: imageData.filename,
              path: imageData.localPath,
              localPath: imageData.localPath,
              githubUrl: imageData.githubUrl,
              storageType: imageData.githubUrl ? 'both' : 'local',
              isMain,
            },
          });
        } catch (error) {
          return NextResponse.json({ 
            ok: false, 
            error: `Ошибка загрузки изображения: ${error.message}` 
          }, { status: 400 });
        }
      }
    }

    // Получаем продукт с изображениями
    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: { 
        images: true, 
        category: true, 
        brand: true, 
        spine: true 
      },
    });

    return NextResponse.json({ ok: true, data: productWithImages }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// PUT временно отключаем
export async function PUT() {
  return NextResponse.json({ ok: false, error: "Use PATCH for updates" }, { status: 405 });
}