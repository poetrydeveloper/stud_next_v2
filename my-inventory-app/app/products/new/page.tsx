'use client'
import { useState } from 'react'

export default function NewProductForm() {
  const [files, setFiles] = useState<FileList | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('files', file)
      })
    }

    const res = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2">
      <input type="text" name="name" placeholder="Название товара" className="border p-2 w-full" />
      <input type="text" name="code" placeholder="Код товара" className="border p-2 w-full" />
      <textarea name="description" placeholder="Описание" className="border p-2 w-full" />
      <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Создать товар
      </button>
    </form>
  )
}
