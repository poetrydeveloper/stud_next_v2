// app/page.tsx
'use client'

import { useState } from 'react'

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
      {/* Контент вкладок */}
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'products' && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🗂️</div>
              <p className="text-lg">Карта товаров</p>
              <p className="text-sm">Miller Columns View будет здесь</p>
            </div>
          </div>
        )}

        {activeTab === 'cashday' && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-lg">Текущий кассовый день</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-lg">Аналитика и отчеты</p>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📤</div>
              <p className="text-lg">Экспорт данных</p>
            </div>
          </div>
        )}
      </div>

      {/* Нижняя панель для мобильной навигации */}
      <div className="bg-white border-t border-gray-200 p-2 md:hidden">
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