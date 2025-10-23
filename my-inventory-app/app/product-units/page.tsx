// app/product-units/page.tsx (ФИНАЛЬНАЯ ВЕРСИЯ)
import prisma from "@/app/lib/prisma";
import UnitTreeView from "@/app/components/unit/UnitTreeView";

export default async function ProductUnitsPage() {
  try {
    // Загружаем категории с вложенностью и units
    const categories = await prisma.category.findMany({
      include: {
        spines: {
          include: {
            productUnits: {
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
                logs: {
                  orderBy: { createdAt: 'desc' },
                  take: 3
                }
              },
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Считаем статистику
    const totalUnits = await prisma.productUnit.count();
    const candidateUnits = await prisma.productUnit.count({
      where: { statusCard: "CANDIDATE" }
    });

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Заголовок и статистика */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Товарные единицы
                </h1>
                <p className="text-gray-600">
                  Дерево категорий с группировкой по Spine
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Всего: <span className="font-semibold">{totalUnits}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Кандидатов: <span className="font-semibold text-yellow-600">{candidateUnits}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Дерево с UnitTreeView */}
          <UnitTreeView categories={categories} />
          
          {categories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет категорий</h3>
              <p className="text-gray-500 mb-4">Создайте категории и Spine чтобы начать работу</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading product units:", error);
    return <ErrorPage />;
  }
}

function ErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😞</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h1>
        <p className="text-gray-600 mb-6">Не удалось загрузить дерево категорий.</p>
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