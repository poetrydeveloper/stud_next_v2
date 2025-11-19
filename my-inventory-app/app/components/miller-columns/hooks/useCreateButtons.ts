// miller columns / hooks / use create button
import { ColumnItem } from '../types'
import styles from '../MillerColumns.module.css'

interface UseCreateButtonsProps {
  columnIndex: number
  isCollapsed: boolean
  parentType?: 'category' | 'spine' | null
  showCreateButtons: boolean
  onCreateCategory?: (parentCategory?: any) => void
  onCreateSpine?: (category: any) => void
  onCreateProduct?: (spine?: any, category?: any) => void
}

export function useCreateButtons({
  columnIndex,
  isCollapsed,
  parentType,
  showCreateButtons,
  onCreateCategory,
  onCreateSpine,
  onCreateProduct
}: UseCreateButtonsProps) {

  const getCreateButtons = () => {
    if (isCollapsed) return null

    // КОРНЕВАЯ КОЛОНКА
    if (columnIndex === 0) {
      return (
        <div className={styles.millerCreateButtons}>
          <button 
            className={styles.millerCreateBtn}
            onClick={() => {
              console.log('🎯 ROOT CREATE CATEGORY CLICKED')
              onCreateCategory?.()
            }}
          >
            + Категория
          </button>
        </div>
      )
    }

    if (!showCreateButtons) return null

    // КОЛОНКА КАТЕГОРИИ
    if (parentType === 'category') {
      return (
        <div className={styles.millerCreateButtons}>
          <button 
            className={styles.millerCreateBtn}
            onClick={() => {
              console.log('🎯 COLUMN CREATE CATEGORY CLICKED')
              onCreateCategory?.()
            }}
          >
            + Категория
          </button>
          <button 
            className={styles.millerCreateBtn}
            onClick={() => {
              console.log('🎯 COLUMN CREATE SPINE CLICKED')
              onCreateSpine?.()
            }}
          >
            + Spine
          </button>
        </div>
      )
    }

    // КОЛОНКА SPINE
    if (parentType === 'spine') {
      return (
        <div className={styles.millerCreateButtons}>
          <button 
            className={styles.millerCreateBtn}
            onClick={() => {
              console.log('🎯 COLUMN CREATE PRODUCT CLICKED')
              onCreateProduct?.()
            }}
          >
            + Продукт
          </button>
        </div>
      )
    }

    return null
  }

  const getItemCreateButtons = (item: ColumnItem) => {
    if (isCollapsed) return null

    // Для категорий
    if (item.type === 'category') {
      return (
        <div className={styles.millerItemCreateButtons}>
          <button 
            className={styles.millerItemCreateBtn}
            onClick={(e) => {
              e.stopPropagation()
              console.log('🎯 CREATE SUBCATEGORY CLICKED:', {
                categoryName: item.data.name,
                categoryId: item.data.id,
              })
              onCreateCategory?.(item.data)
            }}
            title="Создать подкатегорию"
          >
            +📁
          </button>
          <button 
            className={styles.millerItemCreateBtn}
            onClick={(e) => {
              e.stopPropagation()
              console.log('🎯 CREATE SPINE CLICKED:', {
                categoryName: item.data.name,
                categoryId: item.data.id,
              })
              onCreateSpine?.(item.data)
            }}
            title="Создать Spine"
          >
            +🟢
          </button>
        </div>
      )
    }

    // Для spine - ПОЛНАЯ ОТЛАДКА!
    if (item.type === 'spine') {
      return (
        <div className={styles.millerItemCreateButtons}>
          <button 
            className={styles.millerItemCreateBtn}
            onClick={(e) => {
              e.stopPropagation()
              
              // ПРИНУДИТЕЛЬНАЯ ОТЛАДКА
              console.log('🎯🎯🎯 CREATE PRODUCT BUTTON CLICKED!')
              console.log('🔍 Full spine data:', item.data)
              console.log('🔍 onCreateProduct function:', onCreateProduct)
              console.log('🔍 Function type:', typeof onCreateProduct)
              
              // ВРЕМЕННО - покажем alert чтобы убедиться что клик работает
              alert(`Кнопка "+📦" нажата! Spine: ${item.data.name}`)
              
              // Проверяем что функция существует перед вызовом
              if (onCreateProduct) {
                console.log('🚀 Calling onCreateProduct with:', {
                  spine: item.data,
                  category: item.data.category
                })
                onCreateProduct(item.data, item.data.category)
                console.log('✅ onCreateProduct called successfully')
              } else {
                console.error('❌ ERROR: onCreateProduct is undefined!')
                console.error('❌ Available props:', {
                  onCreateCategory: !!onCreateCategory,
                  onCreateSpine: !!onCreateSpine,
                  onCreateProduct: !!onCreateProduct
                })
              }
            }}
            title="Создать продукт"
          >
            +📦
          </button>
        </div>
      )
    }

    return null
  }

  return {
    getCreateButtons,
    getItemCreateButtons
  }
}