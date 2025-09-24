// app/product-units/page.tsx

import prisma from "@/app/lib/prisma";
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
          <div key={unit.id} className="bg-white p-4 rounded shadow flex flex-col justify-between">
            {/* Основная информация */}
            <div>
              <p><strong>Серийный номер:</strong> {unit.serialNumber}</p>
              <p><strong>Продукт:</strong> {unit.productName || unit.product?.name}</p>
              <p><strong>Код:</strong> {unit.productCode || unit.product?.code}</p>
              <p><strong>Статус карточки:</strong> {unit.statusCard}</p>
              <p><strong>Статус продукта:</strong> {unit.statusProduct}</p>
              {unit.isReturned && <p className="text-red-500">Возврат: {unit.returnedAt?.toLocaleString()}</p>}
            </div>

            {/* Продажи / кредит / действия */}
            <ProductUnitActions
              unit={unit}
              onUpdate={(updatedUnit) => {
                // Можно обновить UI при действии, например через state или SWR, если хотим интерактивность
                console.log("Unit updated:", updatedUnit);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
