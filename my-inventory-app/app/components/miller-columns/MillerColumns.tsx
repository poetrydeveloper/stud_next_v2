'use client'

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

  if (loading) {
    return (
      <div className={styles.millerLoadingContainer}>
        <div className={styles.millerSpinner}></div>
        <div className={styles.millerLoadingText}>Загрузка категорий...</div>
      </div>
    )
  }

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
            onCreateProduct={handleCreateProduct}
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

      {createModal.type === 'product' && createModal.spine && (
        <CreateProductModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onProductCreated={handleProductCreated}
          spineId={createModal.spine.id}
          categoryId={createModal.category?.id}
        />
      )}
    </div>
  )
}