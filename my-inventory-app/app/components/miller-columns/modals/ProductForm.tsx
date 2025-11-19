// components/miller-columns/modals/ProductForm.tsx
'use client'

import { X } from 'lucide-react'
import { FormFields } from './FormFields'
import { ImageSection } from './ImageSection'
import { FormActions } from './FormActions'

interface ProductFormProps {
  formData: any
  setFormData: (data: any) => void
  brands: any[]
  spines: any[]
  brandsLoading: boolean
  spinesLoading: boolean
  selectedImages: File[]
  imagePreviews: string[]
  loading: boolean
  spineId?: number
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export function ProductForm({
  formData,
  setFormData,
  brands,
  spines,
  brandsLoading,
  spinesLoading,
  selectedImages,
  imagePreviews,
  loading,
  spineId,
  onImageSelect,
  onRemoveImage,
  onSubmit,
  onClose
}: ProductFormProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Создать продукт</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFields 
              formData={formData}
              setFormData={setFormData}
              brands={brands}
              spines={spines}
              brandsLoading={brandsLoading}
              spinesLoading={spinesLoading}
              spineId={spineId}
            />
            
            <ImageSection 
              selectedImages={selectedImages}
              imagePreviews={imagePreviews}
              onImageSelect={onImageSelect}
              onRemoveImage={onRemoveImage}
              formData={formData}
              setFormData={setFormData}
            />
          </div>

          <FormActions loading={loading} onClose={onClose} />
        </form>
      </div>
    </div>
  )
}