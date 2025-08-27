// app/products/new/page.tsx
'use client'
import { useState, useEffect } from 'react'

interface Category {
  id: number;
  name: string;
}

export default function NewProductForm() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('Загружаем категории...')
    fetch('/api/categories')
      .then(res => {
        console.log('Статус ответа:', res.status)
        return res.json()
      })
      .then(data => {
        console.log('Получены категории:', data)
        setCategories(data)
      })
      .catch(error => console.error('Ошибка загрузки категорий:', error))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const form = e.currentTarget
    const formData = new FormData(form)

    // Добавим логирование что отправляем
    console.log('Отправляемые данные:')
    for (const [key, value] of formData.entries()) {
      console.log(key, value)
    }

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('images', file)
        console.log('Добавлен файл:', file.name)
      })
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      console.log('Ответ сервера:', data)
      
      if (res.ok) {
        alert('Товар успешно создан!')
        form.reset()
        setFiles(null)
      } else {
        alert('Ошибка: ' + (data.error || 'Не удалось создать товар'))
      }
    } catch (error) {
      console.error('Ошибка сети:', error)
      alert('Ошибка сети')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2 max-w-md">
      <input type="text" name="name" placeholder="Название товара" className="border p-2 w-full" required />
      <input type="text" name="code" placeholder="Код товара" className="border p-2 w-full" required />
      <textarea name="description" placeholder="Описание" className="border p-2 w-full" />
      
      {/* Выбор категории */}
      <div>
        <label className="block mb-1">Категория:</label>
        <select name="categoryId" className="border p-2 w-full">
          <option value="">Без категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Изображения:</label>
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
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50"
      >
        {loading ? 'Создание...' : 'Создать товар'}
      </button>
    </form>
  )
}
