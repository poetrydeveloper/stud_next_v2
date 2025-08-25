"use client"

import { useEffect, useState } from "react"

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

function renderTree(categories: Category[]) {
  return (
    <ul className="ml-4">
      {categories.map(cat => (
        <li key={cat.id}>
          {cat.name}
          {cat.children && cat.children.length > 0 && renderTree(cat.children)}
        </li>
      ))}
    </ul>
  )
}

export default function CategoriesTreePage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch("/api/categories/tree")
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Дерево категорий</h1>
      {renderTree(categories)}
    </div>
  )
}
