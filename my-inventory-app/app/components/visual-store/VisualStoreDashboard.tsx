'use client'

import { useState, useEffect } from 'react'
import { ProductBubble } from './ProductBubble'
import { VisualizationLegend } from './VisualizationLegend'
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
      // Показываем сообщение об ошибке
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

  if (loading && productGroups.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Загрузка визуальной аналитики...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
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

      <VisualizationLegend />
      
      <div className="mb-6">
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

      <div className="space-y-8">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {productGroups.length === 0 ? 'Нет данных для отображения' : 'Нет товаров в выбранной категории'}
          </div>
        ) : (
          <CategorySection 
            categoryName={selectedCategory === 'all' ? 'Все товары' : selectedCategory}
            groups={filteredGroups}
            onAddToCandidates={addToCandidates}
          />
        )}
      </div>
    </div>
  )
}