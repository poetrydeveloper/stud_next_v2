//app/categories/new/page.tsx
"use client"

import { useState, useEffect } from "react"

// ProductImage интерфейс
interface ProductImage {
  id: number;
  url: string;
  productId: number;
}

// Product интерфейс
interface Product {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  categoryId?: number | null;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImage[];
}

// Category интерфейс
interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  parent?: Category;
  children?: Category[];
  products: Product[];
}

// FlatCategory интерфейс для плоского списка
interface FlatCategory {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
}

export default function NewCategoryPage() {
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState<number | null>(null)
  const [categories, setCategories] = useState<FlatCategory[]>([])

  useEffect(() => {
    // Используем новый endpoint для плоского списка
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Ошибка загрузки категорий:", error))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Slug теперь генерируется на сервере, поэтому не нужно отправлять его
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parentId })
    })
    
    if (res.ok) {
      alert("Категория создана!")
      setName("")
      setParentId(null)
      // Обновляем список категорий после создания
      fetch("/api/categories")
        .then(res => res.json())
        .then(data => setCategories(data))
    } else {
      alert("Ошибка при создании категории")
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Создать категорию</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <div>
          <label className="block mb-1">Название категории</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="Введите название"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Родительская категория (необязательно)</label>
          <select
            className="border p-2 rounded w-full"
            value={parentId ?? ""}
            onChange={e => setParentId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Без родителя</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Создать
        </button>
      </form>
    </div>
  )
}
