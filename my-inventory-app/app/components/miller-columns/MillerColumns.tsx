// components/miller-columns/MillerColumns.tsx - ОБНОВЛЕННЫЙ С РАЗВЕРТКОЙ
'use client'

import { useState, useEffect } from 'react'
import Column from './Column'
import { Category, Spine, Product, ColumnItem } from './types'
import styles from './MillerColumns.module.css'

interface MillerColumnsProps {
  onProductSelect: (product: Product) => void
}

export default function MillerColumns({ onProductSelect }: MillerColumnsProps) {
  const [columns, setColumns] = useState<ColumnItem[][]>([[]])
  const [selectedItems, setSelectedItems] = useState<number[]>([]) // ID выбранных элементов по колонкам
  const [loading, setLoading] = useState(true)
  const [activeColumn, setActiveColumn] = useState<number | null>(null)
  const [collapsedColumns, setCollapsedColumns] = useState<number[]>([]) // Колонки с эффектом сминания

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
        setActiveColumn(0)
        setCollapsedColumns([])
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
        
        // Эффект сминания: добавляем текущую колонку в свернутые
        setCollapsedColumns(prev => [...prev.filter(idx => idx !== columnIndex), columnIndex])
        setActiveColumn(columnIndex + 1)
        
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
        
        // Эффект сминания: добавляем текущую колонку в свернутые
        setCollapsedColumns(prev => [...prev.filter(idx => idx !== columnIndex), columnIndex])
        setActiveColumn(columnIndex + 1)
        
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

  // НОВАЯ ФУНКЦИЯ: Развернуть колонку при клике на свернутый элемент
  const expandColumn = (columnIndex: number) => {
    // Убираем эффект сминания для этой колонки
    setCollapsedColumns(prev => prev.filter(idx => idx !== columnIndex))
    setActiveColumn(columnIndex)
  }

  const handleItemSelect = async (item: ColumnItem, columnIndex: number) => {
    // Если колонка свернута - сначала разворачиваем ее
    if (collapsedColumns.includes(columnIndex)) {
      expandColumn(columnIndex)
      return
    }
    
    if (item.type === 'category') {
      await loadCategoryChildren(item.data as Category, columnIndex)
    } else if (item.type === 'spine') {
      await loadSpineProducts(item.data as Spine, columnIndex)
    } else if (item.type === 'product') {
      // Для продуктов не загружаем новую колонку, а открываем табло
      const newSelectedItems = selectedItems.slice(0, columnIndex)
      newSelectedItems.push(item.data.id)
      setSelectedItems(newSelectedItems)
      
      // Эффект сминания для последней колонки с продуктом
      setCollapsedColumns(prev => [...prev.filter(idx => idx !== columnIndex), columnIndex])
      
      onProductSelect(item.data as Product)
    }
  }

  const handleColumnReset = (columnIndex: number) => {
    // Сбрасываем колонки до выбранного индекса
    const newColumns = columns.slice(0, columnIndex + 1)
    setColumns(newColumns)
    setSelectedItems(prev => prev.slice(0, columnIndex))
    
    // Убираем эффект сминания для колонок после сброшенной
    setCollapsedColumns(prev => prev.filter(idx => idx <= columnIndex))
    setActiveColumn(columnIndex)
  }

  // Проверяем, выбран ли элемент в колонке
  const isItemSelected = (columnIndex: number, itemId: number) => {
    return selectedItems[columnIndex] === itemId
  }

  // Получаем тип родительского элемента для колонки
  const getParentTypeForColumn = (columnIndex: number): 'category' | 'spine' | null => {
    if (columnIndex === 0) return null
    
    const parentItem = columns[columnIndex - 1]?.find(item => 
      selectedItems[columnIndex - 1] === item.data.id
    )
    
    return parentItem?.type === 'spine' ? 'spine' : 'category'
  }

  // Проверяем, должна ли колонка быть свернутой
  const isColumnCollapsed = (columnIndex: number) => {
    return collapsedColumns.includes(columnIndex)
  }

  if (loading) {
    return (
      <div className={styles.millerLoadingContainer}>
        <div className={styles.millerSpinner}></div>
        <div className={styles.millerLoadingText}>Загрузка категорий...</div>
      </div>
    )
  }

  return (
    <div className={styles.millerWrapper}>
      <div className={styles.millerScroller}>
        {columns.map((columnItems, index) => (
          <Column
            key={index}
            items={columnItems}
            columnIndex={index}
            onItemSelect={handleItemSelect}
            onColumnReset={handleColumnReset}
            isLastColumn={index === columns.length - 1}
            isItemSelected={(itemId) => isItemSelected(index, itemId)}
            isActive={activeColumn === index}
            isCollapsed={isColumnCollapsed(index)}
            parentType={getParentTypeForColumn(index)}
            showCreateButtons={index === columns.length - 1}
          />
        ))}
        
        {columns.length === 0 && (
          <div className={styles.millerEmptyState}>
            <div className={styles.millerEmptyIcon}>📁</div>
            <div className={styles.millerEmptyText}>Нет данных для отображения</div>
            <button 
              className={styles.millerRetryButton}
              onClick={loadRootCategories}
            >
              Попробовать снова
            </button>
          </div>
        )}
      </div>
    </div>
  )
}