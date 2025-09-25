// app/product-units/UnitDetailClient.tsx
"use client";

import ProductUnitActions from "@/app/components/ProductUnitActions";

export default function UnitDetailClient({ unit }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <ProductUnitActions
          unit={unit}
          onUpdate={(updatedUnit) => {
            console.log("Unit updated:", updatedUnit);
          }}
        />
      </div>
    </div>
  );
}
