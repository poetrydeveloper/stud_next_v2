// app/product-units/[id]/page.tsx
import prisma from "@/app/lib/prisma";
import UnitDetailClient from "@/app/product-units/UnitDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductUnitDetailPage({ params }: PageProps) {
  const { id } = await params;
  const unitId = Number(id);

  const unit = await prisma.productUnit.findUnique({
    where: { id: unitId },
    include: { 
      spine: true,
      supplier: true,
      customer: true,
      product: {
        include: {
          category: true,    // ← ДОБАВЛЕНО: категория продукта
          spine: true,       // ← ДОБАВЛЕНО: спайн продукта
          brand: true,       // ← ДОБАВЛЕНО: бренд продукта
          images: true       // ← ДОБАВЛЕНО: изображения продукта
        }
      },
    },
  });

  if (!unit) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Единица товара не найдена</h1>
          <a href="/product-units" className="text-blue-600 hover:underline">
            Вернуться к списку единиц
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Заголовок с хлебными крошками */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <a href="/product-units" className="hover:text-blue-600 transition-colors">
            Единицы товара
          </a>
          <span>›</span>
          <span className="text-gray-900 font-medium">{unit.serialNumber}</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {unit.productName || unit.product?.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Серийный номер: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{unit.serialNumber}</span>
        </p>
      </div>

      <UnitDetailClient unit={unit} />
    </div>
  );
}