'use client'

import { useState, useEffect } from 'react'
import { VisualizationLegend } from './VisualizationLegend'
import { CompactVisualization } from './CompactVisualization'
import { CategorySection } from './CategorySection'

interface ProductGroup {
  productCode: string
  brandName: string
  categoryName: string
  inStoreCount: number
  inRequestCount: number
  weeklySales: number
  totalCount: number
  color: string
  trafficLight: {
    minStock: number
    normalStock: number
    goodStock: number
    weeklySales: number
  }
}

export default function VisualStoreDashboard() {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact')
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchData = async (force = false) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/visual-dashboard/data?force=${force}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProductGroups(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch data:', error)
      alert('Ошибка загрузки данных. Проверьте консоль для подробностей.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    const interval = setInterval(() => fetchData(), 30 * 1000)
    return () => clearInterval(interval)
  }, [])

  const addToCandidates = async (productCode: string, brandName: string) => {
    try {
      const response = await fetch('/api/visual-dashboard/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productCode, brandName })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      fetchData(true)
    } catch (error) {
      console.error('Failed to add to candidates:', error)
      alert('Ошибка добавления в кандидаты')
    }
  }

  const categories = ['all', ...new Set(productGroups
    .filter(g => g.categoryName && g.categoryName !== 'Без категории')
    .map(g => g.categoryName)
    .sort()
  )]

  const filteredGroups = selectedCategory === 'all' 
    ? productGroups 
    : productGroups.filter(g => g.categoryName === selectedCategory)

  // Функция для рендеринга детального режима
  const renderDetailedView = () => {
    if (selectedCategory === 'all') {
      // Группируем все продукты по категориям для детального режима
      const groupsByCategory = productGroups.reduce((acc, group) => {
        const category = group.categoryName
        if (!acc[category]) acc[category] = []
        acc[category].push(group)
        return acc
      }, {} as Record<string, ProductGroup[]>)

      const sortedCategories = Object.entries(groupsByCategory)
        .sort(([a], [b]) => a.localeCompare(b))

      return sortedCategories.map(([categoryName, groups]) => (
        <CategorySection 
          key={categoryName}
          categoryName={categoryName} 
          groups={groups}
          onAddToCandidates={addToCandidates}
        />
      ))
    } else {
      // Одна категория в детальном режиме
      return (
        <CategorySection 
          categoryName={selectedCategory}
          groups={filteredGroups}
          onAddToCandidates={addToCandidates}
        />
      )
    }
  }

  if (loading && productGroups.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Загрузка визуальной аналитики...</div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Визуальная аналитика склада</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Обновлено: {lastUpdate.toLocaleTimeString()}
          </span>
          <button 
            onClick={() => fetchData(true)}
            disabled={loading}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '🔄 Загрузка...' : '🔄 Обновить'}
          </button>
        </div>
      </div>

      {/* Переключатель режимов */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-2">
            Фильтр по категориям:
          </label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded w-full max-w-xs"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? '📁 Все категории' : `📂 ${category}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Режим отображения:
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-2 rounded text-sm ${
                viewMode === 'compact' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📊 Компактный (общий экран)
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-2 rounded text-sm ${
                viewMode === 'detailed' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📋 Детальный (по категориям)
            </button>
          </div>
        </div>
      </div>

      <VisualizationLegend />
      
      <div className="space-y-4">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {productGroups.length === 0 ? 'Нет данных для отображения' : 'Нет товаров в выбранной категории'}
          </div>
        ) : viewMode === 'compact' ? (
          <CompactVisualization 
            productGroups={filteredGroups}
            onAddToCandidates={addToCandidates}
          />
        ) : (
          renderDetailedView()
        )}
      </div>
    </div>
  )
}