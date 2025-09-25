// app/products/page.tsx

import prisma from "@/app/lib/prisma";
import ProductCard from "@/app/components/ProductCard";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { category: true, brand: true, images: true },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Продукты</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
