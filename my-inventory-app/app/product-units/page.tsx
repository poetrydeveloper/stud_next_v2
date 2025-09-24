// app/product-units/page.tsx

import prisma from "@/app/lib/prisma";
import ProductUnitCard from "@/app/components/ProductUnitCard";
import ProductUnitActions from "@/app/components/ProductUnitActions";

/**
 * Страница списка всех единиц товара.
 * Загружает последние 200 единиц и отображает их в виде карточек с информацией и действиями.
 */
export default async function ProductUnitsPage() {
  const units = await prisma.productUnit.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { product: true },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Единицы товара</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {units.map((unit) => (
          <div key={unit.id} className="flex flex-col gap-4">
            {/* Карточка с основной информацией */}
            <ProductUnitCard unit={unit} />

            {/* Действия: продажа, возврат, кредит */}
            <ProductUnitActions
              unit={unit}
              onUpdate={(updatedUnit) => {
                console.log("Unit updated:", updatedUnit);
                // Здесь можно обновлять state или SWR для интерактивности
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
