// app/super-add/components/ProductModal/index.tsx
'use client';

import { useState } from 'react';
import { ModalProps } from '../../types';
import { useBrandsSuppliers } from './hooks/useBrandsSuppliers';
import { useCreateEntities } from './hooks/useCreateEntities';
import { useImageUpload } from './hooks/useImageUpload';
import { ImageUploadSection } from './components/ImageUploadSection';

interface ProductModalProps extends ModalProps {
  selectedPath?: string; // ← ДОБАВИТЬ ЭТОТ ПРОПС
}

export default function ProductModal({ onClose, onSubmit, selectedPath }: ProductModalProps) {
  console.log('🔍 ProductModal: Компонент загружен');
  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brandId, setBrandId] = useState<number | ''>('');
  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [newBrand, setNewBrand] = useState('');
  const [newSupplier, setNewSupplier] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingBrand, setCreatingBrand] = useState(false);
  const [creatingSupplier, setCreatingSupplier] = useState(false);
  const [errors, setErrors] = useState<{ 
    code?: string; 
    name?: string;
    newBrand?: string;
    newSupplier?: string;
  }>({});

  const { brands, suppliers, reload } = useBrandsSuppliers();
  const { createBrand, createSupplier } = useCreateEntities(reload);
  const { images, previewUrls, handleImageSelect, removeImage, clearImages } = useImageUpload();

  const handleCreateBrand = async () => {
    console.log('🔄 ProductModal: Создание бренда');
    if (!newBrand.trim()) {
      setErrors(prev => ({ ...prev, newBrand: 'Введите название бренда' }));
      return;
    }

    if (newBrand.trim().length < 2) {
      setErrors(prev => ({ ...prev, newBrand: 'Название бренда должно быть не менее 2 символов' }));
      return;
    }

    setCreatingBrand(true);
    try {
      const createdBrandId = await createBrand(newBrand.trim());
      await reload();
      setBrandId(createdBrandId);
      setNewBrand('');
      setErrors(prev => ({ ...prev, newBrand: undefined }));
      console.log('✅ ProductModal: Бренд создан и выбран');
    } catch (error) {
      console.error('❌ ProductModal: Ошибка создания бренда:', error);
      alert(`Ошибка создания бренда: ${error.message}`);
    } finally {
      setCreatingBrand(false);
    }
  };

  const handleCreateSupplier = async () => {
    console.log('🔄 ProductModal: Создание поставщика');
    if (!newSupplier.trim()) {
      setErrors(prev => ({ ...prev, newSupplier: 'Введите название поставщика' }));
      return;
    }

    if (newSupplier.trim().length < 2) {
      setErrors(prev => ({ ...prev, newSupplier: 'Название поставщика должно быть не менее 2 символов' }));
      return;
    }

    setCreatingSupplier(true);
    try {
      const createdSupplierId = await createSupplier(newSupplier.trim());
      await reload();
      setSupplierId(createdSupplierId);
      setNewSupplier('');
      setErrors(prev => ({ ...prev, newSupplier: undefined }));
      console.log('✅ ProductModal: Поставщик создан и выбран');
    } catch (error) {
      console.error('❌ ProductModal: Ошибка создания поставщика:', error);
      alert(`Ошибка создания поставщика: ${error.message}`);
    } finally {
      setCreatingSupplier(false);
    }
  };

  const validateForm = (): boolean => {
    console.log('🔄 ProductModal: Валидация формы');
    const newErrors: typeof errors = {};
    
    if (!code.trim()) {
      newErrors.code = 'Артикул обязателен';
    } else if (code.trim().length < 2) {
      newErrors.code = 'Артикул должен быть не менее 2 символов';
    }

    if (!name.trim()) {
      newErrors.name = 'Название продукта обязательно';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Название должно быть не менее 2 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔄 ProductModal: Начало отправки формы', {
        selectedPath, imagesCount: images.length
    });
    
    if (!validateForm()) return;

    // ПРОВЕРКА ЧТО ВЫБРАН SPINE
    if (!selectedPath) {
        alert('❌ Сначала выберите категорию или spine в дереве!');
        return;
    }

    setLoading(true);
    try {
        // ПОЛУЧАЕМ SPINE ID ИЗ ВЫБРАННОГО ПУТИ
        let spineId: number | undefined;
        
        // Ищем spine по selectedPath
        const spineResponse = await fetch(`/api/structure/find-spine?path=${encodeURIComponent(selectedPath)}`);
        const spineData = await spineResponse.json();
        
        if (spineData.ok && spineData.data) {
        spineId = spineData.data.id;
        console.log('✅ Найден spine:', spineData.data);
        } else {
        throw new Error('Не удалось найти spine по выбранному пути. Убедитесь что выбрана категория со spine.');
        }

        // Создаем FormData
        const formData = new FormData();
        formData.append('code', code.trim());
        formData.append('name', name.trim());
        formData.append('description', description.trim());
        formData.append('spineId', spineId.toString()); // ← ОБЯЗАТЕЛЬНО!
        
        if (brandId) formData.append('brandId', brandId.toString());
        if (supplierId) formData.append('supplierId', supplierId.toString());
        
        images.forEach(image => {
        formData.append('images', image);
        });

        console.log('📤 Отправка FormData со spineId:', spineId);

        const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
        });

        const result = await response.json();
        
        if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }

        if (result.ok) {
        console.log('✅ Продукт создан успешно');
        clearImages();
        setCode('');
        setName('');
        setDescription('');
        setBrandId('');
        setSupplierId('');
        onClose();
        
        if (confirm(`Продукт "${name}" создан! Перейти к продуктам?`)) {
            window.location.href = '/products';
        }
        } else {
        throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
        alert(`Ошибка: ${error.message}`);
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Создать Продукт</h3>
        <form onSubmit={handleSubmit}>
          {/* Основные поля */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Артикул/Код *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Например: FR75510"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.code 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-purple-500'
                }`}
                autoFocus
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название продукта *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Ключ рожковый 10мм"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-purple-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Описание */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание товара (необязательно)"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Загрузка изображений */}
          <ImageUploadSection
            images={images}
            previewUrls={previewUrls}
            onImageSelect={handleImageSelect}
            onRemoveImage={removeImage}
          />

          {/* Бренд и поставщик */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Бренд секция */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Бренд
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Выберите бренд</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              
              <div className="mt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="Создать новый бренд"
                    className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.newBrand 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleCreateBrand}
                    disabled={creatingBrand || !newBrand.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingBrand ? '...' : '+'}
                  </button>
                </div>
                {errors.newBrand && (
                  <p className="text-red-500 text-sm mt-1">{errors.newBrand}</p>
                )}
              </div>
            </div>

            {/* Поставщик секция */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Поставщик
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Выберите поставщика</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              
              <div className="mt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    placeholder="Создать нового поставщика"
                    className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.newSupplier 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleCreateSupplier}
                    disabled={creatingSupplier || !newSupplier.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingSupplier ? '...' : '+'}
                  </button>
                </div>
                {errors.newSupplier && (
                  <p className="text-red-500 text-sm mt-1">{errors.newSupplier}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Создание...' : 'Создать продукт'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}