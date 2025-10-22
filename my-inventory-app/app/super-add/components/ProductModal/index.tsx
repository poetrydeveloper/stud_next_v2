// app/super-add/components/ProductModal/index.tsx
'use client';

import { useState } from 'react';
import { ModalProps } from '../../types';
import { useBrandsSuppliers } from './hooks/useBrandsSuppliers';
import { useCreateEntities } from './hooks/useCreateEntities';
import { ProductForm } from './components/ProductForm';

export default function ProductModal({ onClose, onSubmit }: ModalProps) {
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
    console.log('🔄 ProductModal: Начало отправки формы');
    
    if (!validateForm()) {
      console.log('❌ ProductModal: Валидация не пройдена');
      return;
    }

    setLoading(true);
    try {
      console.log('📤 ProductModal: Отправка данных продукта', {
        code, name, description, brandId, supplierId
      });
      
      await onSubmit(
        code.trim(), 
        name.trim(), 
        description.trim(), 
        brandId || undefined, 
        supplierId || undefined
      );
      
      console.log('✅ ProductModal: Продукт успешно создан');
      
    } catch (error) {
      console.error('❌ ProductModal: Ошибка создания продукта:', error);
      alert(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <ProductForm
        code={code}
        name={name}
        description={description}
        brandId={brandId}
        supplierId={supplierId}
        newBrand={newBrand}
        newSupplier={newSupplier}
        brands={brands}
        suppliers={suppliers}
        loading={loading}
        creatingBrand={creatingBrand}
        creatingSupplier={creatingSupplier}
        errors={errors}
        onCodeChange={setCode}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onBrandChange={setBrandId}
        onSupplierChange={setSupplierId}
        onNewBrandChange={setNewBrand}
        onNewSupplierChange={setNewSupplier}
        onCreateBrand={handleCreateBrand}
        onCreateSupplier={handleCreateSupplier}
        onSubmit={handleSubmit}
        onClose={onClose}
      />
    </div>
  );
}