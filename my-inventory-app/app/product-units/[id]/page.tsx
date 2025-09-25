// app/product-units/[id]/page.tsx
import prisma from "@/app/lib/prisma";
import UnitDetailClient from "@/app/product-units/UnitDetailClient";

interface PageProps {
  params: { id: string };
}

export default async function ProductUnitDetailPage({ params }: PageProps) {
  const unitId = Number(params.id);

  const unit = await prisma.productUnit.findUnique({
    where: { id: unitId },
    include: { product: true },
  });

  if (!unit) {
    return <div className="p-6 text-red-500">Единица товара не найдена</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Единица товара: {unit.serialNumber}
      </h1>

      <UnitDetailClient unit={unit} />
    </div>
  );
}
