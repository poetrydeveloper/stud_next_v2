// app/products/page.tsx
import prisma from "@/app/lib/prisma";
import ProductCard from "@/app/components/ProductCard";

export default async function ProductsPage() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      include: { 
        category: true, 
        brand: true, 
        images: true,
        spine: true // ← ДОБАВИТЬ spine для вашего ProductCard
      },
    });

    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Продукты</h1>
          <a
            href="/products/new"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Создать продукт
          </a>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Продукты пока не созданы</p>
            <a
              href="/products/new"
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              Создать первый продукт
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading products:", error);
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Ошибка при загрузке продуктов</p>
          <p className="text-sm mt-1">Попробуйте обновить страницу или обратитесь к администратору</p>
          <details className="mt-2 text-xs">
            <summary>Техническая информация</summary>
            {error instanceof Error ? error.message : "Неизвестная ошибка"}
          </details>
        </div>
      </div>
    );
  }
}