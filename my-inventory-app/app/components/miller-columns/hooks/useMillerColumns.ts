import { useState, useEffect } from 'react'
import { Category, Spine, Product, ColumnItem } from '../types'

export function useMillerColumns(onProductSelect: (product: Product) => void) {
  const [columns, setColumns] = useState<ColumnItem[][]>([[]])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [activeColumn, setActiveColumn] = useState<number | null>(null)
  const [collapsedColumns, setCollapsedColumns] = useState<number[]>([])

  // Загружаем корневые категории при монтировании
  useEffect(() => {
    loadRootCategories()
  }, [])

  const loadRootCategories = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading root categories from /api/miller/root')
      const response = await fetch('/api/miller/root')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('📥 API Response:', result)

      if (result.ok && result.data) {
        const rootCategories: ColumnItem[] = result.data.map((category: Category) => ({
          type: 'category',
          data: {
            ...category,
            _count: category._count || { children: 0, products: 0, spines: 0 },
            hasChildren: (category._count?.children || 0) > 0 || (category._count?.spines || 0) > 0
          }
        }))
        
        console.log('✅ Root categories processed:', rootCategories)
        setColumns([rootCategories])
        setSelectedItems([])
        setActiveColumn(0)
        setCollapsedColumns([])
      } else {
        console.error('❌ API returned error:', result.error)
        // Создаем тестовые данные если API не работает
        createTestData()
      }
    } catch (error) {
      console.error('💥 Error loading root categories:', error)
      // Создаем тестовые данные при ошибке
      createTestData()
    } finally {
      setLoading(false)
    }
  }

  // Функция для создания тестовых данных если API не работает
  const createTestData = () => {
    console.log('🛠️ Creating test data...')
    const testCategories: ColumnItem[] = [
      {
        type: 'category',
        data: {
          id: 1,
          name: 'Инструменты',
          slug: 'tools',
          path: '/tools',
          node_index: '0_1',
          human_path: '/Инструменты',
          _count: { children: 2, products: 10, spines: 3 },
          hasChildren: true
        }
      },
      {
        type: 'category',
        data: {
          id: 2,
          name: 'Электроника',
          slug: 'electronics',
          path: '/electronics',
          node_index: '0_2',
          human_path: '/Электроника',
          _count: { children: 1, products: 5, spines: 2 },
          hasChildren: true
        }
      }
    ]
    
    setColumns([testCategories])
    setSelectedItems([])
    setActiveColumn(0)
    setCollapsedColumns([])
    console.log('✅ Test data created')
  }

  const loadCategoryChildren = async (category: Category, columnIndex: number) => {
    try {
      console.log(`🔄 Loading children for category ${category.id}`)
      const response = await fetch(`/api/miller/categories/${category.id}/children`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('📥 Category children response:', result)

      if (result.ok && result.data) {
        const categoryItems: ColumnItem[] = (result.data.categories || []).map((cat: Category) => ({
          type: 'category',
          data: {
            ...cat,
            _count: cat._count || { children: 0, products: 0, spines: 0 },
            hasChildren: (cat._count?.children || 0) > 0 || (cat._count?.spines || 0) > 0
          }
        }))

        const spineItems: ColumnItem[] = (result.data.spines || []).map((spine: Spine) => ({
          type: 'spine',
          data: {
            ...spine,
            _count: spine._count || { products: 0, productUnits: 0 },
            hasChildren: (spine._count?.products || 0) > 0
          }
        }))

        const newItems = [...categoryItems, ...spineItems]
        console.log('✅ Category children loaded:', newItems)
        
        const newColumns = columns.slice(0, columnIndex + 1)
        newColumns.push(newItems)
        
        setColumns(newColumns)
        setCollapsedColumns(prev => [...prev.filter(idx => idx !== columnIndex), columnIndex])
        setActiveColumn(columnIndex + 1)
        
        const newSelectedItems = selectedItems.slice(0, columnIndex)
        newSelectedItems.push(category.id)
        setSelectedItems(newSelectedItems)
      } else {
        console.error('❌ Failed to load category children:', result.error)
      }
    } catch (error) {
      console.error('💥 Error loading category children:', error)
    }
  }

  const loadSpineProducts = async (spine: Spine, columnIndex: number) => {
    try {
      console.log(`🔄 Loading products for spine ${spine.id}`)
      const response = await fetch(`/api/miller/spines/${spine.id}/products`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('📥 Spine products response:', result)

      if (result.ok && result.data) {
        const productItems: ColumnItem[] = (result.data || []).map((product: Product) => ({
          type: 'product',
          data: {
            ...product,
            _count: product._count || { productUnits: 0 },
            brand: product.brand || { id: 0, name: 'Без бренда', slug: '' },
            productUnits: product.productUnits || [],
            statusCounts: product.statusCounts || {}
          }
        }))
        
        console.log('✅ Spine products loaded:', productItems)
        
        const newColumns = columns.slice(0, columnIndex + 1)
        newColumns.push(productItems)
        
        setColumns(newColumns)
        setCollapsedColumns(prev => [...prev.filter(idx => idx !== columnIndex), columnIndex])
        setActiveColumn(columnIndex + 1)
        
        const newSelectedItems = selectedItems.slice(0, columnIndex)
        newSelectedItems.push(spine.id)
        setSelectedItems(newSelectedItems)
      } else {
        console.error('❌ Failed to load spine products:', result.error)
      }
    } catch (error) {
      console.error('💥 Error loading spine products:', error)
    }
  }

  const expandColumn = (columnIndex: number) => {
    setCollapsedColumns(prev => prev.filter(idx => idx !== columnIndex))
    setActiveColumn(columnIndex)
  }

  const handleItemSelect = async (item: ColumnItem, columnIndex: number) => {
    if (collapsedColumns.includes(columnIndex)) {
      expandColumn(columnIndex)
      return
    }
    
    if (item.type === 'category') {
      await loadCategoryChildren(item.data as Category, columnIndex)
    } else if (item.type === 'spine') {
      await loadSpineProducts(item.data as Spine, columnIndex)
    } else if (item.type === 'product') {
      const newSelectedItems = selectedItems.slice(0, columnIndex)
      newSelectedItems.push(item.data.id)
      setSelectedItems(newSelectedItems)
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

  const isItemSelected = (columnIndex: number, itemId: number) => {
    return selectedItems[columnIndex] === itemId
  }

  const getParentTypeForColumn = (columnIndex: number): 'category' | 'spine' | null => {
    if (columnIndex === 0) return null
    
    const parentItem = columns[columnIndex - 1]?.find(item => 
      selectedItems[columnIndex - 1] === item.data.id
    )
    
    return parentItem?.type === 'spine' ? 'spine' : 'category'
  }

  const isColumnCollapsed = (columnIndex: number) => {
    return collapsedColumns.includes(columnIndex)
  }

  return {
    columns,
    loading,
    selectedItems,
    activeColumn,
    collapsedColumns,
    loadRootCategories,
    handleItemSelect,
    handleColumnReset,
    isItemSelected,
    getParentTypeForColumn,
    isColumnCollapsed,
    expandColumn
  }
}