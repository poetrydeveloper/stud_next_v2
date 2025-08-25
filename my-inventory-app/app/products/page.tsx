"use client"

import { useEffect, useState } from "react"

interface Product {
  id: number
  code: string
  name: string
  description?: string
  category?: { id: number; name: string } | null
  images: { id: number; path: string; isMain: boolean }[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-4">Загрузка...</div>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Список товаров</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-md flex flex-col"
          >
            {product.images.length > 0 ? (
              <img
                src={`/${product.images.find(img => img.isMain)?.path || product.images[0].path}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-2">
                Нет изображения
              </div>
            )}
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">Код: {product.code}</p>
            {product.category && (
              <p className="text-sm">Категория: {product.category.name}</p>
            )}
            {product.description && (
              <p className="text-sm mt-2">{product.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
