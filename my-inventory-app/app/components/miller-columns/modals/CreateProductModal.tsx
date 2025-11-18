'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Upload, Image as ImageIcon } from 'lucide-react'

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
  onProductCreated: (product: any) => void
  spineId?: number
  categoryId?: number
}

interface Brand {
  id: number
  name: string
}

interface Spine {
  id: number
  name: string
  node_index?: string
  human_path?: string
}

export default function CreateProductModal({ 
  isOpen, 
  onClose, 
  onProductCreated,
  spineId,
  categoryId 
}: CreateProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [spines, setSpines] = useState<Spine[]>([])
  const [brandsLoading, setBrandsLoading] = useState(true)
  const [spinesLoading, setSpinesLoading] = useState(true)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    brandId: '',
    spineId: spineId ? spineId.toString() : '',
  })

  // Загружаем бренды и spines при открытии модалки
  useEffect(() => {
    if (isOpen) {
      fetchBrands()
      fetchSpines()
    }
  }, [isOpen])

  const fetchBrands = async () => {
    try {
      setBrandsLoading(true)
      const response = await fetch('/api/brands')
      if (response.ok) {
        const brandsData = await response.json()
        setBrands(brandsData)
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setBrandsLoading(false)
    }
  }

  const fetchSpines = async () => {
    try {
      setSpinesLoading(true)
      let url = '/api/spines'
      if (categoryId) {
        url += `?categoryId=${categoryId}`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const spinesData = await response.json()
        setSpines(spinesData)
        
        // Если передан spineId, устанавливаем его по умолчанию
        if (spineId && !formData.spineId) {
          setFormData(prev => ({ ...prev, spineId: spineId.toString() }))
        }
      }
    } catch (error) {
      console.error('Error fetching spines:', error)
    } finally {
      setSpinesLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    setSelectedImages(prev => [...prev, ...newFiles])

    // Создаем превью
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      
      // Добавляем текстовые данные
      submitData.append('name', formData.name)
      submitData.append('code', formData.code)
      submitData.append('description', formData.description)
      submitData.append('brandId', formData.brandId)
      submitData.append('spineId', formData.spineId)
      
      if (categoryId) {
        submitData.append('categoryId', categoryId.toString())
      }

      // Добавляем изображения
      selectedImages.forEach((image, index) => {
        submitData.append('images', image)
      })

      const response = await fetch('/api/products', {
        method: 'POST',
        body: submitData,
        // Не устанавливаем Content-Type - браузер сделает это сам с boundary
      })

      const result = await response.json()

      if (response.ok && result.ok) {
        onProductCreated(result.data)
        handleClose()
      } else {
        alert(result.error || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      brandId: '',
      spineId: spineId ? spineId.toString() : '',
    })
    setSelectedImages([])
    setImagePreviews([])
    // Очищаем объекты URL для предотвращения утечек памяти
    imagePreviews.forEach(url => URL.revokeObjectURL(url))
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Создать продукт</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Основная информация */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Код продукта *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Например: ART-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название продукта *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Например: Набор бит 50 предметов"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Бренд *
                </label>
                {brandsLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm text-gray-500">Загрузка брендов...</span>
                  </div>
                ) : (
                  <select
                    required
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Выберите бренд</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spine *
                </label>
                {spinesLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm text-gray-500">Загрузка spines...</span>
                  </div>
                ) : (
                  <select
                    required
                    value={formData.spineId}
                    onChange={(e) => setFormData({ ...formData, spineId: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!!spineId} // Если spineId передан, делаем поле readonly
                  >
                    <option value="">Выберите spine</option>
                    {spines.map((spine) => (
                      <option key={spine.id} value={spine.id}>
                        {spine.name} {spine.human_path && `(${spine.human_path})`}
                      </option>
                    ))}
                  </select>
                )}
                {spineId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Spine предварительно выбран из навигации
                  </p>
                )}
              </div>
            </div>

            {/* Изображения и описание */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Изображения
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer p-4 hover:bg-gray-50 rounded"
                  >
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 text-center">
                      Нажмите для загрузки изображений<br />
                      <span className="text-xs text-gray-400">Поддерживаются JPG, PNG</span>
                    </span>
                  </label>
                  
                  {/* Превью изображений */}
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
                            onClick={() => removeImage(index)}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Описание продукта..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Создание...</span>
                </>
              ) : (
                <>
                  <ImageIcon size={16} />
                  <span>Создать продукт</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}