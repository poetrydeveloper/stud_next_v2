'use client'
import { useState } from 'react'

export default function UploadForm({ productId }: { productId: string }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(`/api/products/${productId}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Фото успешно загружены!');
        setFiles(null);
      } else {
        alert('Ошибка загрузки');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка сети');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label className="block mb-2">Добавить фотографии:</label>
        <input 
          type="file" 
          multiple 
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
          className="border p-2 w-full"
        />
      </div>
      
      {files && files.length > 0 && (
        <p>Выбрано файлов: {files.length}</p>
      )}
      
      <button 
        type="submit" 
        disabled={!files || uploading}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {uploading ? 'Загрузка...' : 'Загрузить'}
      </button>
    </form>
  );
}