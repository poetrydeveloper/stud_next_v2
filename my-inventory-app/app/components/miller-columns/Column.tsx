// components/miller-columns/Column.tsx - ОБНОВЛЕННЫЙ С ОТЛАДКОЙ
'use client'

import { ColumnItem } from './types'
import CategoryCell from './CategoryCell'
import SpineCell from './SpineCell'
import ProductCell from './ProductCell'
import styles from './MillerColumns.module.css'

interface ColumnProps {
  items: ColumnItem[]
  columnIndex: number
  onItemSelect: (item: ColumnItem, columnIndex: number) => void
  onColumnReset: (columnIndex: number) => void
  isLastColumn: boolean
  isItemSelected: (itemId: number) => boolean
  isActive?: boolean
  isCollapsed?: boolean
  parentType?: 'category' | 'spine' | null
  showCreateButtons?: boolean
  onCreateCategory?: (parentCategory?: any) => void
  onCreateSpine?: (category: any) => void
}

export default function Column({ 
  items, 
  columnIndex, 
  onItemSelect, 
  onColumnReset,
  isLastColumn,
  isItemSelected,
  isActive = false,
  isCollapsed = false,
  parentType,
  showCreateButtons = false,
  onCreateCategory,
  onCreateSpine
}: ColumnProps) {

  // ФУНКЦИЯ ДЛЯ КНОПОК СОЗДАНИЯ В ШАПКЕ КОЛОНКИ
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

    // КОЛОНКА КАТЕГОРИИ - кнопки для создания в текущем контексте
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
          <button className={styles.millerCreateBtn}>
            + Продукт
          </button>
        </div>
      )
    }

    return null
  }

  // ФУНКЦИЯ ДЛЯ КНОПОК СОЗДАНИЯ НА КАЖДОЙ КАРТОЧКЕ
  const getItemCreateButtons = (item: ColumnItem) => {
    if (isCollapsed) return null

    // Для ВСЕХ категорий показываем кнопки создания
    if (item.type === 'category') {
      return (
        <div className={styles.millerItemCreateButtons}>
          <button 
            className={styles.millerItemCreateBtn}
            onClick={(e) => {
              e.stopPropagation() // Предотвращаем выбор элемента
              console.log('🎯 CREATE SUBCATEGORY CLICKED:', {
                categoryName: item.data.name,
                categoryId: item.data.id,
                onCreateCategoryExists: !!onCreateCategory,
                columnIndex,
                parentType
              })
              if (onCreateCategory) {
                console.log('🎯 CALLING onCreateCategory with:', item.data)
                onCreateCategory(item.data)
              } else {
                console.error('❌ onCreateCategory is UNDEFINED!')
              }
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
                onCreateSpineExists: !!onCreateSpine,
                columnIndex,
                parentType
              })
              if (onCreateSpine) {
                console.log('🎯 CALLING onCreateSpine with:', item.data)
                onCreateSpine(item.data)
              } else {
                console.error('❌ onCreateSpine is UNDEFINED!')
              }
            }}
            title="Создать Spine"
          >
            +🟢
          </button>
        </div>
      )
    }

    // Для ВСЕХ spine показываем кнопку создания продукта
    if (item.type === 'spine') {
      return (
        <div className={styles.millerItemCreateButtons}>
          <button 
            className={styles.millerItemCreateBtn}
            onClick={(e) => {
              e.stopPropagation()
              console.log('🎯 CREATE PRODUCT CLICKED:', {
                spineName: item.data.name,
                spineId: item.data.id
              })
              // onCreateProduct?.(item.data) - нужно добавить эту функцию
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

  const getCellComponent = (item: ColumnItem, index: number) => {
    const commonProps = {
      item: item.data,
      onClick: () => onItemSelect(item, columnIndex),
      isSelected: isItemSelected(item.data.id),
      showChildrenIndicator: item.type !== 'product' && item.data.hasChildren,
      isCollapsed: isCollapsed
    }

    // Оборачиваем каждую ячейку в контейнер с кнопками создания
    const CellWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className={styles.millerCellWithButtons}>
        {children}
        {getItemCreateButtons(item)}
      </div>
    )

    switch (item.type) {
      case 'category':
        return (
          <CellWrapper key={`category-${item.data.id}-${index}`}>
            <CategoryCell {...commonProps} />
          </CellWrapper>
        )
      case 'spine':
        return (
          <CellWrapper key={`spine-${item.data.id}-${index}`}>
            <SpineCell {...commonProps} />
          </CellWrapper>
        )
      case 'product':
        return (
          <CellWrapper key={`product-${item.data.id}-${index}`}>
            <ProductCell {...commonProps} />
          </CellWrapper>
        )
      default:
        return null
    }
  }

  return (
    <div className={`${styles.millerColumn} ${isCollapsed ? styles.collapsed : ''} ${isActive ? styles.millerColumnActive : ''}`}>
      {/* Кнопки создания в шапке колонки */}
      {getCreateButtons()}

      {/* Список элементов */}
      <div className={styles.millerList}>
        {items.length === 0 && !isCollapsed ? (
          <div className={styles.millerEmptyState}>
            <div className={styles.millerEmptyIcon}>📁</div>
            <div className={styles.millerEmptyText}>
              Нет элементов
            </div>
          </div>
        ) : (
          items.map((item, index) => getCellComponent(item, index))
        )}
      </div>

      {/* Статус бар */}
      {!isCollapsed && (
        <div className={styles.millerStatusBar}>
          <span className={styles.millerItemCount}>{items.length}</span>
        </div>
      )}
    </div>
  )
}