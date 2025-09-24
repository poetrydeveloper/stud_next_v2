// app/product-units/[id]/page.tsx

import prisma from "@/app/lib/prisma";
import ProductUnitActions from "@/app/components/ProductUnitActions";

/**
 * Страница детальной единицы товара.
 * Загружает единицу по ID и отображает всю информацию:
 * - данные продукта
 * - статусы (card, product, returned)
 * - продажи и возвраты
 * - действия (продать, вернуть, погасить кредит)
 */
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Левая колонка — информация о продукте */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Информация о продукте</h2>
          <p><strong>Название:</strong> {unit.productName}</p>
          <p><strong>Код:</strong> {unit.productCode}</p>
          <p><strong>Категория:</strong> {unit.productCategoryName}</p>
          <p><strong>Описание:</strong> {unit.productDescription || "—"}</p>
          <p><strong>Цена заявки:</strong> {unit.requestPricePerUnit || "—"} ₽</p>
          <p><strong>Статус карточки:</strong> {unit.statusCard}</p>
          <p><strong>Физический статус:</strong> {unit.statusProduct}</p>
          {unit.isReturned && <p className="text-red-500">Возврат оформлен: {unit.returnedAt?.toLocaleString()}</p>}
        </div>

        {/* Правая колонка — продажи и действия */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Продажи и действия</h2>
          {unit.statusProduct === "SOLD" && !unit.isCredit && (
            <>
              <p><strong>Продано:</strong> {unit.buyerName} {unit.buyerPhone}</p>
              <p><strong>Цена продажи:</strong> {unit.salePrice} ₽</p>
              <p><strong>Дата продажи:</strong> {unit.soldAt?.toLocaleString()}</p>
            </>
          )}

          {unit.isCredit && (
            <>
              <p><strong>Продано в кредит:</strong> {unit.buyerName} {unit.buyerPhone}</p>
              <p><strong>Дата продажи:</strong> {unit.soldAt?.toLocaleString()}</p>
              {unit.creditPaidAt && <p><strong>Долг погашен:</strong> {unit.creditPaidAt?.toLocaleString()}</p>}
            </>
          )}

          {/* Компонент действий */}
          <ProductUnitActions
            unit={unit}
            onUpdate={(updatedUnit) => {
              // для обновления UI при действии можно использовать state, если хотим интерактивность
              console.log("Unit updated:", updatedUnit);
            }}
          />
        </div>
      </div>
    </div>
  );
}
