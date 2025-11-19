// components/miller-columns/modals/hooks/useImageUpload.ts
'use client'

import { useState } from 'react'

export function useImageUpload() {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    setSelectedImages(prev => [...prev, ...newFiles])

    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const clearImages = () => {
    setSelectedImages([])
    imagePreviews.forEach(url => URL.revokeObjectURL(url))
    setImagePreviews([])
  }

  return {
    selectedImages,
    imagePreviews,
    handleImageSelect,
    removeImage,
    clearImages
  }
}