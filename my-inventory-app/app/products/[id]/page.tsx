// app/products/[id]/page.tsx

import prisma from "@/app/lib/prisma";
import Link from "next/link";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = Number(params.id);

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      images: true,
    },
  });

  if (!product) {
    return <div className="container mx-auto p-6">Продукт не найден</div>;
  }

  const mainImage = product.images[0];

  return (
    <div className="container mx-auto p-6 max-w-md">
      <div className="bg-white shadow rounded p-4 flex flex-col items-center">
        {mainImage && (
          <img
            src={mainImage.path}
            alt={mainImage.filename}
            className="w-48 h-48 object-cover rounded mb-4"
          />
        )}

        <h1 className="text-xl font-bold mb-2 text-center">{product.name}</h1>
        <p className="text-gray-600 text-sm mb-1">Код: {product.code}</p>
        <p className="text-gray-600 text-sm mb-1">
          Категория: {product.category?.name || "-"}
        </p>
        <p className="text-gray-600 text-sm mb-2">
          Бренд: {product.brand?.name || "-"}
        </p>

        {product.description && (
          <p className="text-gray-700 text-sm mb-4 text-center">{product.description}</p>
        )}

        <div className="flex gap-2">
          <Link
            href={`/products/${product.id}/edit`}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
          >
            Редактировать
          </Link>
          <Link
            href="/products"
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
          >
            Назад
          </Link>
        </div>
      </div>
    </div>
  );
}
