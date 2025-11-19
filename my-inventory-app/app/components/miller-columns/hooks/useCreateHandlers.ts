// components/miller-columns/hooks/useCreateHandlers.ts
import { ColumnItem } from '../types'
import { apiService } from '../services/apiService'

export function useCreateHandlers(
  columns: ColumnItem[][],
  selectedItems: number[],
  handleItemSelect: (item: ColumnItem, columnIndex: number) => Promise<void>,
  loadRootCategories: () => Promise<void>
) {
  const handleCreateSubmit = async (name: string, parentId?: number) => {
    try {
      console.log('🎯 handleCreateSubmit called:', { name, parentId })
      
      // Определяем тип создания по контексту
      const lastSelectedItemId = selectedItems[selectedItems.length - 1]
      const lastColumn = columns[columns.length - 1]
      const selectedItem = lastColumn?.find(item => item.data.id === lastSelectedItemId)
      
      if (selectedItem?.type === 'category') {
        // Создаем подкатегорию
        console.log('📁 Creating subcategory for:', selectedItem.data.name)
        await apiService.createCategory(name, selectedItem.data.id)
        await handleItemSelect(selectedItem, columns.length - 1)
      } else if (parentId) {
        // Создаем spine в категории
        console.log('🟢 Creating spine for category ID:', parentId)
        await apiService.createSpine(name, parentId)
        await loadRootCategories() // Перезагружаем корневые категории
      } else {
        // Создаем корневую категорию
        console.log('🏠 Creating root category')
        await apiService.createCategory(name)
        await loadRootCategories()
      }
    } catch (error) {
      console.error('❌ Error in handleCreateSubmit:', error)
      throw error
    }
  }

  const handleProductCreated = async (newProduct: any) => {
    console.log('✅ Продукт создан:', newProduct)
    
    // Находим spine по ID созданного продукта
    const spineId = newProduct.spineId
    if (spineId) {
      // Ищем колонку, содержащую этот spine
      const spineColumnIndex = columns.findIndex(column => 
        column.some(item => item.type === 'spine' && item.data.id === spineId)
      )
      
      if (spineColumnIndex !== -1) {
        const spineItem = columns[spineColumnIndex].find(item => 
          item.type === 'spine' && item.data.id === spineId
        )
        
        if (spineItem) {
          console.log('🔄 Перезагружаем продукты для spine:', spineItem.data.name)
          await handleItemSelect(spineItem, spineColumnIndex)
        }
      }
    }
  }

  return {
    handleCreateSubmit,
    handleProductCreated
  }
}