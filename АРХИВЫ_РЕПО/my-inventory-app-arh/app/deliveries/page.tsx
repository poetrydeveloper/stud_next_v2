// app/deliveries/page.tsx
import prisma from "@/app/lib/prisma";
import DeliveryUnitsGrid from "./DeliveryUnitsGrid";

export default async function DeliveriesPage() {
  // Получаем units со статусом IN_REQUEST, сгруппированные по дате заявки
  const units = await prisma.productUnit.findMany({
    where: { 
      statusCard: "IN_REQUEST" 
    },
    include: { 
      product: {
        include: {
          images: {
            where: { isMain: true },
            take: 1
          },
          brand: true
        }
      },
      spine: true,
      parentProductUnit: {  // Для группировки SPROUTED родителей
        include: {
          product: true
        }
      },
      childProductUnits: {  // Для отображения детей SPROUTED
        where: {
          statusCard: "IN_REQUEST"
        }
      }
    },
    orderBy: { 
      createdAtRequest: "asc"  // Сортировка по дате заявки
    }
  });

  // Группируем units по дате заявки
  const groupedByDate = units.reduce((acc, unit) => {
    const dateKey = unit.createdAtRequest ? unit.createdAtRequest.toISOString().split('T')[0] : 'no-date';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(unit);
    return acc;
  }, {} as Record<string, typeof units>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Поставки товаров
          </h1>
          <p className="text-gray-600">
            Приемка товаров по заявкам
          </p>
        </div>

        <DeliveryUnitsGrid groupedUnits={groupedByDate} />
      </div>
    </div>
  );
}