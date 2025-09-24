// app/products/page.tsx

import Link from "next/link";
import prisma from "@/app/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { category: true, brand: true },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Продукты</h1>
      <Link
        href="/products/new"
        className="mb-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Создать продукт
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded shadow p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p>Код: {p.code}</p>
              <p>Категория: {p.category?.name || "-"}</p>
              <p>Бренд: {p.brand?.name || "-"}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <Link
                href={`/products/${p.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Подробнее
              </Link>
              <Link
                href={`/products/${p.id}/edit`}
                className="text-yellow-600 hover:underline text-sm"
              >
                Редактировать
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
