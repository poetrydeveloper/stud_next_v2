// app/components/analytics/SalesAnalytics.tsx
"use client";
import { useState, useEffect } from 'react';

interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  averageSale: number;
  bestSellingDay: string;
  bestSellingHour: string;
}

interface TopProduct {
  productId: number;
  productName: string;
  productCode: string;
  salesCount: number;
  totalRevenue: number;
  averagePrice: number;
}

interface CategoryBreakdown {
  category: string;
  salesCount: number;
  totalRevenue: number;
  percentage: number;
}

interface BrandBreakdown {
  brand: string;
  salesCount: number;
  totalRevenue: number;
}

interface DailyTrend {
  date: string;
  dayName: string;
  salesCount: number;
  totalRevenue: number;
}

interface HourlyTrend {
  hour: number;
  hourLabel: string;
  salesCount: number;
  totalRevenue: number;
}

interface AnalyticsData {
  period: {
    start: string;
    end: string;
    type: string;
  };
  summary: SalesSummary;
  topProducts: TopProduct[];
  categoryBreakdown: CategoryBreakdown[];
  brandBreakdown: BrandBreakdown[];
  dailyTrend: DailyTrend[];
  hourlyTrend: HourlyTrend[];
}

export default function SalesAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'trends'>('overview');

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/sales?period=${period}`);
      const result = await response.json();
      
      if (result.ok) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Загрузка аналитики...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-2">Ошибка загрузки аналитики</div>
        <button
          onClick={loadAnalytics}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок и фильтры */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Аналитика продаж
              </h1>
              <p className="text-gray-600">
                Период: {new Date(data.period.start).toLocaleDateString('ru-RU')} - {new Date(data.period.end).toLocaleDateString('ru-RU')}
              </p>
            </div>
            
            <div className="flex gap-4">
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">📅 За неделю</option>
                <option value="month">📅 За месяц</option>
                <option value="quarter">📅 За квартал</option>
              </select>
              
              <button
                onClick={loadAnalytics}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🔄 Обновить
              </button>
            </div>
          </div>

          {/* Навигация по табам */}
          <div className="flex space-x-1 bg-white rounded-lg border border-gray-200 p-1 w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📈 Обзор
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏆 Товары
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📂 Категории
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'trends'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Тренды
            </button>
          </div>
        </div>

        {/* KPI карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">💰</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{data.summary.totalRevenue.toLocaleString()} ₽</div>
                <div className="text-gray-600 text-sm">Общая выручка</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">🛒</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{data.summary.totalSales}</div>
                <div className="text-gray-600 text-sm">Всего продаж</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">📊</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{Math.round(data.summary.averageSale).toLocaleString()} ₽</div>
                <div className="text-gray-600 text-sm">Средний чек</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">⭐</span>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{data.summary.bestSellingDay}</div>
                <div className="text-gray-600 text-sm">Лучший день</div>
              </div>
            </div>
          </div>
        </div>

        {/* Контент табов */}
        <div>
          {activeTab === 'overview' && <OverviewTab data={data} />}
          {activeTab === 'products' && <ProductsTab data={data} />}
          {activeTab === 'categories' && <CategoriesTab data={data} />}
          {activeTab === 'trends' && <TrendsTab data={data} />}
        </div>
      </div>
    </div>
  );
}

// Компонент вкладки "Обзор"
function OverviewTab({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Топ 5 продуктов */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🏆 Топ 5 товаров
        </h3>
        <div className="space-y-4">
          {data.topProducts.slice(0, 5).map((product, index) => (
            <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{product.productName}</div>
                  <div className="text-sm text-gray-500">{product.productCode}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{product.totalRevenue.toLocaleString()} ₽</div>
                <div className="text-sm text-gray-500">{product.salesCount} продаж</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Топ категории */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          📂 Топ категории
        </h3>
        <div className="space-y-4">
          {data.categoryBreakdown.slice(0, 5).map((category, index) => (
            <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600">
                  {index + 1}
                </div>
                <div className="font-medium text-gray-900">{category.category}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{category.totalRevenue.toLocaleString()} ₽</div>
                <div className="text-sm text-gray-500">{Math.round(category.percentage)}% от выручки</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Компонент вкладки "Товары"
function ProductsTab({ data }: { data: AnalyticsData }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">🏆 Все товары</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Товар
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Продажи
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Выручка
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Средняя цена
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.topProducts.map((product) => (
              <tr key={product.productId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{product.productName}</div>
                  <div className="text-sm text-gray-500">{product.productCode}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.salesCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {product.totalRevenue.toLocaleString()} ₽
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {Math.round(product.averagePrice).toLocaleString()} ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Компонент вкладки "Категории"
function CategoriesTab({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Категории */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">📂 Распределение по категориям</h3>
        <div className="space-y-4">
          {data.categoryBreakdown.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{category.category}</span>
                <span>{Math.round(category.percentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{category.salesCount} продаж</span>
                <span>{category.totalRevenue.toLocaleString()} ₽</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Бренды */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">🏷️ Распределение по брендам</h3>
        <div className="space-y-4">
          {data.brandBreakdown.map((brand) => (
            <div key={brand.brand} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">{brand.brand}</div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{brand.totalRevenue.toLocaleString()} ₽</div>
                <div className="text-sm text-gray-500">{brand.salesCount} продаж</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Компонент вкладки "Тренды"
function TrendsTab({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Тренд по дням */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">📈 Продажи по дням</h3>
        <div className="space-y-3">
          {data.dailyTrend.map((day) => (
            <div key={day.date} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{day.dayName}</div>
                <div className="text-sm text-gray-500">
                  {new Date(day.date).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{day.totalRevenue.toLocaleString()} ₽</div>
                <div className="text-sm text-gray-500">{day.salesCount} продаж</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Тренд по часам */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">🕒 Продажи по часам</h3>
        <div className="space-y-3">
          {data.hourlyTrend.map((hour) => (
            <div key={hour.hour} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">{hour.hourLabel}</div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{hour.totalRevenue.toLocaleString()} ₽</div>
                <div className="text-sm text-gray-500">{hour.salesCount} продаж</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}