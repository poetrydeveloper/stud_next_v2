import { ColumnItem } from '../types'
import { apiService } from '../services/apiService'

export function useCreateHandlers(
  columns: ColumnItem[][],
  selectedItems: number[],
  handleItemSelect: (item: ColumnItem, columnIndex: number) => Promise<void>,
  loadRootCategories: () => Promise<void>
) {
  const handleCreateSubmit = async (name: string, parentId?: number) => {
    // Этот метод теперь только для категорий и spine
    // Продукты обрабатываются отдельно через handleProductCreated
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