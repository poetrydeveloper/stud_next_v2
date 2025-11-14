// app/page.tsx - ОБНОВЛЕННАЯ ВЕРСИЯ
'use client'

import { useState } from 'react'
import MillerColumnsPage from './miller-columns/page'

type ActiveTab = 'products' | 'cashday' | 'analytics' | 'export'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('products')

  const tabs = {
    products: { label: 'Карта товаров', icon: '🗂️' },
    cashday: { label: 'Касса', icon: '💰' },
    analytics: { label: 'Аналитика', icon: '📊' },
    export: { label: 'Экспорт', icon: '📤' }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Верхняя панель вкладок */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-1">
          {Object.entries(tabs).map(([key, tab]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as ActiveTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Контент вкладок */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'products' && <MillerColumnsPage />}
        
        {activeTab === 'cashday' && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg m-4">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-lg">Текущий кассовый день</p>
              <p className="text-sm mt-1">Скоро здесь будет интерфейс кассы</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg m-4">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-lg">Аналитика и отчеты</p>
              <p className="text-sm mt-1">Скоро здесь будут графики и статистика</p>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg m-4">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📤</div>
              <p className="text-lg">Экспорт данных</p>
              <p className="text-sm mt-1">Скоро здесь будет экспорт в Excel</p>
            </div>
          </div>
        )}
      </div>

      {/* Нижняя панель для мобильных устройств */}
      <div className="bg-white border-t border-gray-200 p-2 lg:hidden">
        <div className="flex justify-around">
          {Object.entries(tabs).map(([key, tab]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as ActiveTab)}
              className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] transition-colors ${
                activeTab === key ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}