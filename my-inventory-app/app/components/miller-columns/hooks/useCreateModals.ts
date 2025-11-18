import { useState } from 'react'
import { Category } from '../types'

export function useCreateModals() {
  const [createModal, setCreateModal] = useState<{
    type: 'category' | 'spine' | 'product' | null;
    parentCategory?: Category;
    category?: Category;
    spine?: any;
  }>({ type: null })
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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
  }

  const handleCreateProduct = (spine?: any, category?: Category) => {
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
  }

  const closeCreateModal = () => {
    console.log('🎯 CLOSING MODAL, current state:', { createModal, isCreateModalOpen })
    setIsCreateModalOpen(false)
    setCreateModal({ type: null })
  }

  return {
    createModal,
    isCreateModalOpen,
    handleCreateCategory,
    handleCreateSpine,
    handleCreateProduct,
    closeCreateModal
  }
}