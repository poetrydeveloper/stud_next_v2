// app/products/[id]/edit/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Category {
  id: number
  name: string
}

interface Brand {
  id: number
  name: string
}

interface ProductImage {
  id: number
  path: string
  isMain: boolean
}

interface Product {
  id: number
  code: string
  name: string
  description: string | null
  categoryId: number | null
  brandId: number | null
  images: ProductImage[]
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [files, setFiles] = useState<FileList | null>(null)
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (params.id) {
      Promise.all([fetchProduct(), fetchCategories(), fetchBrands()])
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      }
    } catch (error) {
      console.error('Ошибка загрузки товара:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error)
    }
  }

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands')
      const data = await res.json()
      setBrands(data)
    } catch (error) {
      console.error('Ошибка загрузки брендов:', error)
    }
  }

  const handleImageDelete = (imageId: number) => {
    setImagesToDelete(prev => [...prev, imageId])
    setProduct(prev => prev ? {
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    } : null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append('id', product?.id.toString() || '')
    
    if (imagesToDelete.length > 0) {
      formData.append('deleteImages', imagesToDelete.join(','))
    }

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('images', file)
      })
    }

    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        body: formData,
      })

      const data = await res.json()
      
      if (res.ok) {
        alert('Товар успешно обновлен!')
        router.push(`/products/${product?.id}`)
      } else {
        alert('Ошибка: ' + (data.error || 'Не удалось обновить товар'))
      }
    } catch (error) {
      console.error('Ошибка сети:', error)
      alert('Ошибка сети')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-4">Загрузка...</div>
  if (!product) return <div className="p-4">Товар не найден</div>

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Редактировать товар</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="id" value={product.id} />

        <div>
          <label className="block mb-1">Название товара:</label>
          <input
            type="text"
            name="name"
            defaultValue={product.name}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Код товара:</label>
          <input
            type="text"
            name="code"
            defaultValue={product.code}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Описание:</label>
          <textarea
            name="description"
            defaultValue={product.description || ''}
            className="border p-2 w-full"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1">Категория:</label>
          <select
            name="categoryId"
            defaultValue={product.categoryId || ''}
            className="border p-2 w-full"
          >
            <option value="">Без категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Бренд:</label>
          <select
            name="brandId"
            defaultValue={product.brandId || ''}
            className="border p-2 w-full"
          >
            <option value="">Без бренда</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Текущие изображения:</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {product.images.map((image) => (
              <div key={image.id} className="border rounded p-2 relative">
                <img
                  src={image.path}
                  alt=""
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(image.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                >
                  ×
                </button>
                {image.isMain && (
                  <div className="text-xs text-green-600 text-center mt-1">Главное</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1">Новые изображения:</label>
          <input
            type="file"
            multiple
            name="images"
            onChange={(e) => setFiles(e.target.files)}
            className="border p-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  )
}