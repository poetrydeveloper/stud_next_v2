'use client'
import { useState } from 'react'

export default function UploadForm({ params }: { params: { id: string } }) {
  const [files, setFiles] = useState<FileList | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files) return

    const formData = new FormData()
    Array.from(files).forEach((file) => {
      formData.append('files', file)
    })

    await fetch(`/api/products/${params.id}/upload`, {
      method: 'POST',
      body: formData,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2">
      <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Загрузить</button>
    </form>
  )
}
