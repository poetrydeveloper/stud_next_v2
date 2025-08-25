"use client"

import { useEffect, useState } from "react"

export default function NewProductPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)

  useEffect(() => {
    fetch("/api/categories/tree")
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !name) {
      alert("Код и название обязательны")
      return
    }

    const formData = new FormData()
    formData.append("code", code)
    formData.append("name", name)
    formData.append("description", description)
    if (categoryId) formData.append("categoryId", categoryId.toString())
    if (files) {
      Array.from(files).forEach(file => formData.append("files", file))
    }

    const res = await fetch("/api/products", {
      method: "POST",
      body: formData
    })

    if (res.ok) {
      alert("Товар создан!")
      setCode("")
      setName("")
      setDescription("")
      setCategoryId(null)
      setFiles(null)
    } else {
      alert("Ошибка при создании товара")
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Создать товар</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Код товара"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Название товара"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <textarea
          className="border p-2 rounded"
          placeholder="Описание"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={categoryId ?? ""}
          onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Без категории</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          multiple
          onChange={e => setFiles(e.target.files)}
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Создать товар
        </button>
      </form>
    </div>
  )
}
