// components/miller-columns/MillerColumns.tsx - ПОЛНЫЙ КОД С ОТЛАДКОЙ
'use client'

import { useState, useEffect } from 'react'
import Column from './Column'
import CreateCategoryModal from './modals/CreateCategoryModal'
import CreateSpineModal from './modals/CreateSpineModal'
import { Category, Spine, Product, ColumnItem } from './types'
import styles from './MillerColumns.module.css'

interface MillerColumnsProps {
  onProductSelect: (product: Product) => void
}

export default function MillerColumns({ onProductSelect }: MillerColumnsProps) {
  const [columns, setColumns] = useState<ColumnItem[][]>([[]])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [activeColumn, setActiveColumn] = useState<number | null>(null)
  const [collapsedColumns, setCollapsedColumns] = useState<number[]>([])
  
  // Состояния для модалок
  const [createModal, setCreateModal] = useState<{
    type: 'category' | 'spine' | null;
    parentCategory?: Category;
    category?: Category;
  }>({ type: null })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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

  // Развернуть колонку при клике на свернутый элемент
  const expandColumn = (columnIndex: number) => {
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
    const newColumns = columns.slice(0, columnIndex + 1)
    setColumns(newColumns)
    setSelectedItems(prev => prev.slice(0, columnIndex))
    setCollapsedColumns(prev => prev.filter(idx => idx <= columnIndex))
    setActiveColumn(columnIndex)
  }

  // ОБРАБОТЧИКИ СОЗДАНИЯ ЭЛЕМЕНТОВ
  const handleCreateCategory = (parentCategory?: Category) => {
    console.log('🎯 handleCreateCategory CALLED with:', {
      parentCategory: parentCategory?.name,
      hasParent: !!parentCategory
    })
    setCreateModal({ 
      type: 'category', 
      parentCategory 
    })
    setIsCreateModalOpen(true)
    console.log('🎯 Modal state updated:', { type: 'category', isOpen: true })
  }

  const handleCreateSpine = (category: Category) => {
    console.log('🎯 handleCreateSpine CALLED with:', {
      category: category?.name,
      categoryId: category?.id
    })
    setCreateModal({ 
      type: 'spine', 
      category 
    })
    setIsCreateModalOpen(true)
    console.log('🎯 Modal state updated:', { type: 'spine', isOpen: true })
  }

  // ФУНКЦИИ СОЗДАНИЯ ЧЕРЕЗ API
  const createCategory = async (name: string, parentId?: number) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          parentId: parentId || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create category')
      }

      const newCategory = await response.json()
      
      // Перезагружаем данные после создания
      if (parentId) {
        // Перезагружаем дочерние элементы родительской категории
        const parentColumnIndex = columns.findIndex(col => 
          col.some(item => item.data.id === parentId)
        )
        if (parentColumnIndex !== -1) {
          const parentItem = columns[parentColumnIndex].find(item => item.data.id === parentId)
          if (parentItem) {
            await handleItemSelect(parentItem, parentColumnIndex)
          }
        }
      } else {
        // Если это корневая категория, перезагружаем корень
        await loadRootCategories()
      }

      return newCategory
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  const createSpine = async (name: string, categoryId: number) => {
    try {
      const response = await fetch('/api/spines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          categoryId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create spine')
      }

      const newSpine = await response.json()
      
      // Перезагружаем дочерние элементы категории
      const categoryColumnIndex = columns.findIndex(col => 
        col.some(item => item.data.id === categoryId)
      )
      if (categoryColumnIndex !== -1) {
        const categoryItem = columns[categoryColumnIndex].find(item => item.data.id === categoryId)
        if (categoryItem) {
          await handleItemSelect(categoryItem, categoryColumnIndex)
        }
      }

      return newSpine
    } catch (error) {
      console.error('Error creating spine:', error)
      throw error
    }
  }

  // ОБРАБОТЧИК СОЗДАНИЯ ИЗ МОДАЛКИ
  const handleCreateSubmit = async (name: string, parentId?: number) => {
    if (createModal.type === 'category') {
      await createCategory(name, parentId)
    } else if (createModal.type === 'spine' && createModal.category) {
      await createSpine(name, createModal.category.id)
    }
  }

  const closeCreateModal = () => {
    console.log('🎯 CLOSING MODAL, current state:', { createModal, isCreateModalOpen })
    setIsCreateModalOpen(false)
    setCreateModal({ type: null })
    console.log('🎯 MODAL CLOSED, new state:', { createModal: { type: null }, isCreateModalOpen: false })
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

  // ДОБАВЛЯЕМ ОТЛАДКУ ТЕКУЩЕГО СОСТОЯНИЯ МОДАЛОК
  console.log('🎯 MillerColumns CURRENT MODAL STATE:', {
    createModal,
    isCreateModalOpen
  })

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
            onCreateCategory={handleCreateCategory}
            onCreateSpine={handleCreateSpine}
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

      {/* Модальные окна создания */}
      {createModal.type === 'category' && (
        <CreateCategoryModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onCreate={handleCreateSubmit}
          parentCategory={createModal.parentCategory}
        />
      )}

      {createModal.type === 'spine' && createModal.category && (
        <CreateSpineModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onCreate={handleCreateSubmit}
          category={createModal.category}
        />
      )}
    </div>
  )
}