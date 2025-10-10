// app/product-units/page.tsx (ОБНОВЛЕННАЯ ВЕРСИЯ)
import prisma from "@/app/lib/prisma";
import CompactUnitsView from "./CompactUnitsView";
import CandidateUnitsView from "./CandidateUnitsView";

export default async function ProductUnitsPage() {
  try {
    const units = await prisma.productUnit.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { 
        product: {
          include: {
            images: {
              where: { isMain: true },
              take: 1
            },
            spine: true,
            category: true,
            brand: true
          }
        },
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        spine: true,
        supplier: true,
        customer: true
      },
    });

    // Фильтруем кандидатов и обычные units
    const candidateUnits = units.filter((u) => u.statusCard === "CANDIDATE");
    const normalUnits = units.filter((u) => u.statusCard !== "CANDIDATE");

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Заголовок и статистика */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Единицы товара
                </h1>
                <p className="text-gray-600">
                  Компактный просмотр с группировкой по Spine и брендам
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Всего: <span className="font-semibold">{units.length}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Кандидатов: <span className="font-semibold text-yellow-600">{candidateUnits.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Основные units с новой компактной структурой */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Все единицы товара
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {normalUnits.length} единиц
              </span>
            </div>
            
            <CompactUnitsView units={normalUnits} />
            
            {normalUnits.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет товарных единиц</h3>
                <p className="text-gray-500 mb-4">Создайте первую единицу товара чтобы начать работу</p>
              </div>
            )}
          </section>

          {/* Кандидаты в компактном виде */}
          <CandidateUnitsView units={candidateUnits} />
        </div>
      </div>
    );

  } catch (error) {
    console.error("Error loading product units:", error);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h1>
          <p className="text-gray-600 mb-6">
            Не удалось загрузить список товарных единиц.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }
}