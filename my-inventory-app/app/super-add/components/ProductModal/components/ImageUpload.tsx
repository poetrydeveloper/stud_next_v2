// app/super-add/components/ProductModal/components/ImageUpload.tsx
'use client';

import { useRef } from 'react';

interface ImageUploadProps {
  previewUrls: string[];
  onImagesChange: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
}

export function ImageUpload({ previewUrls, onImagesChange, onRemoveImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 0) {
      console.log('🖼️ ImageUpload: Выбрано файлов:', files.length);
      
      // Проверяем тип файлов
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (validFiles.length !== files.length) {
        console.warn('⚠️ ImageUpload: Некоторые файлы не являются изображениями');
        alert('Некоторые файлы не являются изображениями и будут проигнорированы');
      }
      
      if (validFiles.length > 0) {
        onImagesChange(validFiles);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Изображения товара
      </label>
      
      {/* Кнопка загрузки и информация */}
      <div className="flex items-center gap-3 mb-3">
        <button
          type="button"
          onClick={handleButtonClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>📷</span>
          <span>Выбрать фото</span>
        </button>
        
        <span className="text-sm text-gray-500">
          {previewUrls.length > 0 ? `Выбрано: ${previewUrls.length}` : 'Можно выбрать несколько'}
        </span>
      </div>

      {/* Скрытый input для загрузки файлов */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview изображений */}
      {previewUrls.length > 0 && (
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Предпросмотр:</h4>
          <div className="grid grid-cols-3 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Удалить изображение"
                >
                  ×
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Подсказка */}
      <p className="text-xs text-gray-500 mt-2">
        Поддерживаются форматы: JPG, PNG, WebP. Первое изображение будет главным.
      </p>
    </div>
  );
}