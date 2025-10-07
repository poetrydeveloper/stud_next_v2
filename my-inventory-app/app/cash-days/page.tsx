// app/cash-days/page.tsx
"use client";

import { useState, useEffect } from "react";
import ActiveCashDay from "./components/ActiveCashDay";
import ClosedCashDays from "./components/ClosedCashDays";
import WeeklyStats from "./components/WeeklyStats";

export default function CashDaysPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'closed' | 'stats'>('active');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                💰 Управление кассовыми днями
              </h1>
              <p className="text-gray-600">
                Отслеживание операций и статистика продаж
              </p>
            </div>
          </div>
        </div>

        {/* Навигация по табам */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg border border-gray-200 p-1 w-fit">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🟢 Активный день
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'closed'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📅 Закрытые дни
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Статистика за неделю
            </button>
          </div>
        </div>

        {/* Контент табов */}
        <div>
          {activeTab === 'active' && <ActiveCashDay />}
          {activeTab === 'closed' && <ClosedCashDays />}
          {activeTab === 'stats' && <WeeklyStats />}
        </div>
      </div>
    </div>
  );
}