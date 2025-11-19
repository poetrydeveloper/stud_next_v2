// components/miller-columns/hooks/useCreateModals.ts
import { useState, useCallback } from 'react'
import { Category } from '../types'

export function useCreateModals() {
  const [createModal, setCreateModal] = useState<{
    type: 'category' | 'spine' | 'product' | null;
    parentCategory?: Category;
    category?: Category;
    spine?: any;
  }>({ type: null })
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateCategory = useCallback((parentCategory?: Category) => {
    console.log('🎯 handleCreateCategory CALLED with:', {
      parentCategory: parentCategory?.name,
      hasParent: !!parentCategory
    })
    setCreateModal({ 
      type: 'category', 
      parentCategory 
    })
    setIsCreateModalOpen(true)
  }, [])

  const handleCreateSpine = useCallback((category: Category) => {
    console.log('🎯 handleCreateSpine CALLED with:', {
      category: category?.name,
      categoryId: category?.id
    })
    setCreateModal({ 
      type: 'spine', 
      category 
    })
    setIsCreateModalOpen(true)
  }, [])

  const handleCreateProduct = useCallback((spine?: any, category?: Category) => {
    console.log('🎯 handleCreateProduct CALLED with:', {
      spine: spine?.name,
      spineId: spine?.id,
      category: category?.name
    })
    setCreateModal({ 
      type: 'product', 
      spine,
      category
    })
    setIsCreateModalOpen(true)
  }, [])

  const closeCreateModal = useCallback(() => {
    console.log('🎯 CLOSING MODAL')
    // ВАЖНО: сначала сбрасываем состояние, потом закрываем
    setCreateModal({ type: null })
    setIsCreateModalOpen(false)
  }, [])

  return {
    createModal,
    isCreateModalOpen,
    handleCreateCategory,
    handleCreateSpine,
    handleCreateProduct,
    closeCreateModal
  }
}