"use client"

import { useState, useEffect } from "react"

// ProductImage интерфейс (добавьте нужные поля)
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

export default function NewCategoryPage() {
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch("/api/categories/tree")
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const slug = generateSlug(name)
    
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, parentId })
    })
    
    if (res.ok) {
      alert("Категория создана!")
      setName("")
      setParentId(null)
    } else {
      alert("Ошибка при создании категории")
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Создать категорию</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Название категории"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <select
          className="border p-2 rounded"
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Создать
        </button>
      </form>
    </div>
  )
}
