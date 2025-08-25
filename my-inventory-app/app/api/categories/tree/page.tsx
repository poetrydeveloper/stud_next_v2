"use client"

import { useEffect, useState } from "react"

function renderTree(categories: any[]) {
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
  const [categories, setCategories] = useState<any[]>([])

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
