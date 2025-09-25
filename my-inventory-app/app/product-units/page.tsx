// app/product-units/page.tsx
import prisma from "@/app/lib/prisma";
import UnitsGrid from "./UnitsGrid";

export default async function ProductUnitsPage() {
  const units = await prisma.productUnit.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { product: true },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Единицы товара</h1>
      <UnitsGrid units={units} />
    </div>
  );
}
