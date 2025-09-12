// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    return NextResponse.json(
      { error: "Некорректный ID товара" },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        brand: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }

    // Преобразуем путь к изображениям (если нужно добавить полный URL)
    const formattedProduct = {
      ...product,
      images: product.images.map((img) => ({
        id: img.id,
        path: img.path, // Если изображения хранятся локально, можно добавить `${process.env.NEXT_PUBLIC_BASE_URL}${img.path}`
        isMain: img.isMain,
      })),
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Ошибка при получении товара:", error);
    return NextResponse.json(
      { error: "Не удалось получить товар" },
      { status: 500 }
    );
  }
}
