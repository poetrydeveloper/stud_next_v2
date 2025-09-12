// app/products/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Product {
  id: number
  code: string
  name: string
  description: string | null
  category: { name: string } | null
  brand: { name: string } | null
  images: { id: number; path: string; isMain: boolean }[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params.id) {
      setError('ID товара не указан')
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        console.log('Fetching product with id:', params.id)
        const res = await fetch(`/api/products/${params.id}`)
        console.log('Response status:', res.status)
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Товар не найден')
          return
        }

        setProduct(data)
      } catch (err) {
        console.error('Ошибка загрузки товара:', err)
        setError('Ошибка сети при загрузке товара')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) return <div className="p-4">Загрузка...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!product) return <div className="p-4">Товар не найден</div>

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <Link
          href={`/products/${product.id}/edit`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Редактировать
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Изображения</h2>
          <div className="grid grid-cols-2 gap-4">
            {product.images.length > 0 ? (
              product.images.map((image) => (
                <div key={image.id} className="border rounded-lg p-2">
                  <img
                    src={image.path}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                  {image.isMain && (
                    <p className="text-center text-sm text-green-600 mt-2">
                      Главное
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>Нет изображений</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Информация</h2>
          <div className="space-y-3">
            <p>
              <strong>Код:</strong> {product.code}
            </p>
            <p>
              <strong>Категория:</strong>{' '}
              {product.category?.name || 'Не указана'}
            </p>
            <p>
              <strong>Бренд:</strong> {product.brand?.name || 'Не указан'}
            </p>
            <p>
              <strong>Описание:</strong>{' '}
              {product.description || 'Нет описания'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/products" className="text-blue-500 hover:underline">
          ← Назад к списку товаров
        </Link>
      </div>
    </div>
  )
}
