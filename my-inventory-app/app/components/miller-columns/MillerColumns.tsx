// components/miller-columns/MillerColumns.tsx
'use client'

import { useEffect } from 'react'
import { useMillerColumns } from './hooks/useMillerColumns'
import { useCreateModals } from './hooks/useCreateModals'
import { useCreateHandlers } from './hooks/useCreateHandlers'
import Column from './Column'
import CreateCategoryModal from './modals/CreateCategoryModal'
import CreateSpineModal from './modals/CreateSpineModal'
import CreateProductModal from './modals/CreateProductModal'
import { Product } from './types'
import styles from './MillerColumns.module.css'

interface MillerColumnsProps {
  onProductSelect: (product: Product) => void
}

export default function MillerColumns({ onProductSelect }: MillerColumnsProps) {
  const {
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
  } = useMillerColumns(onProductSelect)

  const {
    createModal,
    isCreateModalOpen,
    handleCreateCategory,
    handleCreateSpine,
    handleCreateProduct,
    closeCreateModal
  } = useCreateModals()

  const {
    handleCreateSubmit,
    handleProductCreated
  } = useCreateHandlers(columns, selectedItems, handleItemSelect, loadRootCategories)

  // ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЙ СОСТОЯНИЯ МОДАЛКИ
  useEffect(() => {
    console.log('🎯 MODAL STATE UPDATED:', {
      createModalType: createModal.type,
      isCreateModalOpen,
      hasSpine: !!createModal.spine,
      spineName: createModal.spine?.name,
      spineId: createModal.spine?.id
    })
  }, [createModal.type, isCreateModalOpen, createModal.spine])

  if (loading) {
    return (
      <div className={styles.millerLoadingContainer}>
        <div className={styles.millerSpinner}></div>
        <div className={styles.millerLoadingText}>Загрузка категорий...</div>
      </div>
    )
  }

  console.log('🎯 MillerColumns RENDER:', {
    columns: columns.map(col => col.length),
    modal: createModal.type,
    modalOpen: isCreateModalOpen
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
            showCreateButtons={index === columns.length - 1}
            onCreateCategory={handleCreateCategory}
            onCreateSpine={handleCreateSpine}
            onCreateProduct={handleCreateProduct}
            allColumns={columns}
            selectedItems={selectedItems}
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

      {/* Модальные окна создания - УПРОЩЕННАЯ ЛОГИКА */}
      {createModal.type === 'category' && (
        <CreateCategoryModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onCreate={handleCreateSubmit}
          parentCategory={createModal.parentCategory}
        />
      )}

      {createModal.type === 'spine' && (
        <CreateSpineModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onCreate={handleCreateSubmit}
          category={createModal.category}
        />
      )}

      {createModal.type === 'product' && (
        <CreateProductModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onProductCreated={handleProductCreated}
          spineId={createModal.spine?.id}
          categoryId={createModal.spine?.categoryId || createModal.category?.id}
        />
      )}

      {/* ДЕБАГ-ИНФОРМАЦИЯ */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          <div>Modal: {createModal.type || 'none'}</div>
          <div>Open: {isCreateModalOpen ? 'yes' : 'no'}</div>
          <div>Spine: {createModal.spine?.name || 'none'}</div>
          <div>SpineId: {createModal.spine?.id || 'none'}</div>
        </div>
      )}
    </div>
  )
}