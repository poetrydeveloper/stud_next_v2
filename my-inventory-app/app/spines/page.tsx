// app/spines/page.tsx
import prisma from "@/app/lib/prisma";
import SpineCard from "@/app/components/SpineCard";

async function getSpines() {
  return await prisma.spine.findMany({
    include: {
      category: true,
      productUnits: {
        include: {
          product: {
            select: {
              brand: {
                select: { name: true }
              }
            }
          }
        }
      },
      _count: {
        select: {
          productUnits: true
        }
      }
    },
    orderBy: { name: "asc" },
  });
}

export default async function SpinesPage() {
  const spines = await getSpines();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Торговые предложения</h1>
        <p className="text-gray-600 mt-2">Группы товарных единиц по характеристикам</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {spines.map(spine => (
          <SpineCard key={spine.id} spine={spine} />
        ))}
      </div>

      {spines.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">Нет торговых предложений</div>
          <p className="text-gray-500 mt-2">Создайте первое торговое предложение</p>
        </div>
      )}
    </div>
  );
}