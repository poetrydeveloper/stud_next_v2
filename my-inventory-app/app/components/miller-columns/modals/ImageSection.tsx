// components/miller-columns/modals/ImageSection.tsx
'use client'

import { X, Upload } from 'lucide-react'

interface ImageSectionProps {
  selectedImages: File[]
  imagePreviews: string[]
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  formData: any
  setFormData: (data: any) => void
}

export function ImageSection({
  selectedImages,
  imagePreviews,
  onImageSelect,
  onRemoveImage,
  formData,
  setFormData
}: ImageSectionProps) {
  return (
    <div className="space-y-4">
      <ImageUpload 
        selectedImages={selectedImages}
        imagePreviews={imagePreviews}
        onImageSelect={onImageSelect}
        onRemoveImage={onRemoveImage}
      />
      
      <DescriptionField 
        value={formData.description}
        onChange={(value: string) => setFormData({ ...formData, description: value })}
      />
    </div>
  )
}

function ImageUpload({ selectedImages, imagePreviews, onImageSelect, onRemoveImage }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Изображения
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onImageSelect}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center cursor-pointer p-4 hover:bg-gray-50 rounded"
        >
          <Upload size={24} className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-600 text-center">
            Нажмите для загрузки изображений
          </span>
        </label>
        
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DescriptionField({ value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Описание
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Описание продукта..."
      />
    </div>
  )
}