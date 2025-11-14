// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inventory System',
  description: 'Система управления инвентарем для планшета',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Верхняя панель с навигацией */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">📦 Магазин</h1>
                
                {/* Основные вкладки */}
                <nav className="flex space-x-1">
                  {[
                    { id: 'products', label: 'Карта товаров', icon: '🗂️' },
                    { id: 'cashday', label: 'Касса', icon: '💰' },
                    { id: 'analytics', label: 'Аналитика', icon: '📊' },
                    { id: 'export', label: 'Экспорт', icon: '📤' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-md hover:bg-gray-100 transition">
                    ⚙️
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Основное содержимое */}
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}