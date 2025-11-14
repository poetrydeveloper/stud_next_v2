// app/super-add/components/ProductModal/components/ImageUploadSection.tsx
interface ImageUploadSectionProps {
  images: File[];
  previewUrls: string[];
  onImageSelect: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
}

export function ImageUploadSection({
  images,
  previewUrls,
  onImageSelect,
  onRemoveImage
}: ImageUploadSectionProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Изображения продукта
      </label>
      
      {/* Preview изображений */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Кнопка загрузки */}
      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
        <div className="flex flex-col items-center justify-center">
          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-600">
            {images.length > 0 ? `Добавлено ${images.length} изображений` : 'Выберите изображения'}
          </span>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => onImageSelect(e.target.files)}
          className="hidden"
        />
      </label>
      
      <p className="text-xs text-gray-500 mt-1">
        Поддерживаются JPG, PNG, WebP. Первое изображение будет главным.
      </p>
    </div>
  );
}