// components/miller-columns/MillerColumns.tsx - ДОБАВЛЯЕМ ВЫДЕЛЕНИЕ
'use client'

import { useState, useEffect } from 'react'
import Column from './Column'
import { Category, Spine, Product, ColumnItem } from './types'

interface MillerColumnsProps {
  onProductSelect: (product: Product) => void
}

export default function MillerColumns({ onProductSelect }: MillerColumnsProps) {
  const [columns, setColumns] = useState<ColumnItem[][]>([[]])
  const [selectedItems, setSelectedItems] = useState<number[]>([]) // ID выбранных элементов по колонкам
  const [loading, setLoading] = useState(true)

  // Загружаем корневые категории при монтировании
  useEffect(() => {
    loadRootCategories()
  }, [])

  const loadRootCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/miller/root')
      const result = await response.json()

      if (result.ok) {
        const rootCategories: ColumnItem[] = result.data.map((category: Category) => ({
          type: 'category',
          data: category
        }))
        
        setColumns([rootCategories])
        setSelectedItems([])
      } else {
        console.error('Failed to load root categories:', result.error)
      }
    } catch (error) {
      console.error('Error loading root categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategoryChildren = async (category: Category, columnIndex: number) => {
    try {
      const response = await fetch(`/api/miller/categories/${category.id}/children`)
      const result = await response.json()

      if (result.ok) {
        const categoryItems: ColumnItem[] = result.data.categories.map((cat: Category) => ({
          type: 'category',
          data: cat
        }))

        const spineItems: ColumnItem[] = result.data.spines.map((spine: Spine) => ({
          type: 'spine',
          data: spine
        }))

        const newItems = [...categoryItems, ...spineItems]
        
        // Обрезаем колонки после текущей и добавляем новую
        const newColumns = columns.slice(0, columnIndex + 1)
        newColumns.push(newItems)
        
        setColumns(newColumns)
        
        // Обновляем выбранные элементы
        const newSelectedItems = selectedItems.slice(0, columnIndex)
        newSelectedItems.push(category.id)
        setSelectedItems(newSelectedItems)
      } else {
        console.error('Failed to load category children:', result.error)
      }
    } catch (error) {
      console.error('Error loading category children:', error)
    }
  }

  const loadSpineProducts = async (spine: Spine, columnIndex: number) => {
    try {
      const response = await fetch(`/api/miller/spines/${spine.id}/products`)
      const result = await response.json()

      if (result.ok) {
        const productItems: ColumnItem[] = result.data.map((product: Product) => ({
          type: 'product',
          data: product
        }))
        
        // Обрезаем колонки после текущей и добавляем продукты
        const newColumns = columns.slice(0, columnIndex + 1)
        newColumns.push(productItems)
        
        setColumns(newColumns)
        
        // Обновляем выбранные элементы
        const newSelectedItems = selectedItems.slice(0, columnIndex)
        newSelectedItems.push(spine.id)
        setSelectedItems(newSelectedItems)
      } else {
        console.error('Failed to load spine products:', result.error)
      }
    } catch (error) {
      console.error('Error loading spine products:', error)
    }
  }

  const handleItemSelect = async (item: ColumnItem, columnIndex: number) => {
    if (item.type === 'category') {
      await loadCategoryChildren(item.data as Category, columnIndex)
    } else if (item.type === 'spine') {
      await loadSpineProducts(item.data as Spine, columnIndex)
    } else if (item.type === 'product') {
      // Для продуктов не загружаем новую колонку, а открываем табло
      const newSelectedItems = selectedItems.slice(0, columnIndex)
      newSelectedItems.push(item.data.id)
      setSelectedItems(newSelectedItems)
      onProductSelect(item.data as Product)
    }
  }

  const handleColumnReset = (columnIndex: number) => {
    // Сбрасываем колонки до выбранного индекса
    setColumns(prev => prev.slice(0, columnIndex + 1))
    setSelectedItems(prev => prev.slice(0, columnIndex))
  }

  // Проверяем, выбран ли элемент в колонке
  const isItemSelected = (columnIndex: number, itemId: number) => {
    return selectedItems[columnIndex] === itemId
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Загрузка категорий...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {columns.map((columnItems, index) => (
        <Column
          key={index}
          items={columnItems}
          columnIndex={index}
          onItemSelect={handleItemSelect}
          onColumnReset={handleColumnReset}
          isLastColumn={index === columns.length - 1}
          isItemSelected={(itemId) => isItemSelected(index, itemId)}
        />
      ))}
      
      {columns.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Нет данных для отображения
        </div>
      )}
    </div>
  )
}