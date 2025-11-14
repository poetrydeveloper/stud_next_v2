import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ApiIntegrationService } from "@/src/modules/file-storage/api-integration.service";

// Пока заглушка - нужно создать инстанс сервиса
const apiIntegrationService = new ApiIntegrationService(/* зависимости */);

/**
 * POST v2 — создание продукта с новой системой хранения изображений
 */
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

    // Создаем продукт
    const product = await prisma.product.create({
      data: { name, code, description, categoryId, brandId, spineId },
    });

    // Загружаем изображения через новую систему
    await apiIntegrationService.handleImageUploadForApi(formData, product.id);

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
    console.error("POST /api/products/v2 error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}