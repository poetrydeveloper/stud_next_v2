// app/product-units/page.tsx
import prisma from "@/app/lib/prisma";
import UnitsGrid from "./UnitsGrid";
import CandidateUnitsGrid from "@/app/components/CandidateUnitsGrid";

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
            category: true
          }
        }
      },
    });

    // Фильтруем кандидатов с улучшенной типизацией
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
                  Управление товарными единицами и кандидатами
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

          {/* Основные units */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Все единицы товара
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {normalUnits.length} единиц
              </span>
            </div>
            <UnitsGrid units={normalUnits} />
            
            {normalUnits.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет товарных единиц</h3>
                <p className="text-gray-500 mb-4">Создайте первую единицу товара чтобы начать работу</p>
                <a
                  href="/product-units/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Создать unit
                </a>
              </div>
            )}
          </section>

          {/* Кандидаты */}
          <CandidateUnitsGrid units={candidateUnits} />
        </div>
      </div>
    );

  } catch (error) {
    console.error("Error loading product units:", error);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-sm border border-red-200">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h1>
            <p className="text-gray-600 mb-6">
              Не удалось загрузить список товарных единиц. Пожалуйста, попробуйте обновить страницу.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      </div>
    );
  }
}