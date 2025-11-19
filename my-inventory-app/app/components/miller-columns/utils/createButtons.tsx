// components/miller-columns/utils/createButtons
import React from 'react'
import { ColumnItem } from '../types'
import styles from '../MillerColumns.module.css'

interface CreateButtonsProps {
  columnIndex: number
  isCollapsed: boolean
  parentType?: 'category' | 'spine' | null
  showCreateButtons: boolean
  onCreateCategory?: (parentCategory?: any) => void
  onCreateSpine?: (category: any) => void
  onCreateProduct?: (spine?: any, category?: any) => void
}

export function getCreateButtons({
  columnIndex,
  isCollapsed,
  parentType,
  showCreateButtons,
  onCreateCategory,
  onCreateSpine,
  onCreateProduct
}: CreateButtonsProps): React.ReactNode {

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

export function getItemCreateButtons(
  item: ColumnItem,
  onCreateCategory?: (parentCategory?: any) => void,
  onCreateSpine?: (category: any) => void,
  onCreateProduct?: (spine?: any, category?: any) => void
): React.ReactNode {

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

  // Для spine
  if (item.type === 'spine') {
    return (
      <div className={styles.millerItemCreateButtons}>
        <button 
          className={styles.millerItemCreateBtn}
          onClick={(e) => {
            e.stopPropagation()
            console.log('🎯 CREATE PRODUCT CLICKED:', {
              spineName: item.data.name,
              spineId: item.data.id,
            })
            onCreateProduct?.(item.data, { id: item.data.categoryId })
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