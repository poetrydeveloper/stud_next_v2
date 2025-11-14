// components/MillerColumns/modals/ProductModal.tsx
'use client';

import { useState } from 'react';
import styles from '../MillerColumns.module.css';
import { useBrandsSuppliers } from './hooks/useBrandsSuppliers';
import { useCreateEntities } from './hooks/useCreateEntities';
import { ProductForm } from './components/ProductForm';

interface ProductModalProps {
  onClose: () => void;
  onSubmit: (code: string, name: string, description?: string, brandId?: number, supplierId?: number) => void;
  parentPath: string;
}

export function ProductModal({ onClose, onSubmit, parentPath }: ProductModalProps) {
  console.log('🔍 ProductModal Miller: Компонент загружен');
  
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
    console.log('🔄 ProductModal Miller: Создание бренда');
    if (!newBrand.trim()) {
      setErrors(prev => ({ ...prev, newBrand: 'Введите название бренда' }));
      return;
    }

    setCreatingBrand(true);
    try {
      const createdBrandId = await createBrand(newBrand.trim());
      await reload();
      setBrandId(createdBrandId);
      setNewBrand('');
      setErrors(prev => ({ ...prev, newBrand: undefined }));
    } catch (error) {
      console.error('❌ ProductModal Miller: Ошибка создания бренда:', error);
      alert(`Ошибка создания бренда: ${error.message}`);
    } finally {
      setCreatingBrand(false);
    }
  };

  const handleCreateSupplier = async () => {
    console.log('🔄 ProductModal Miller: Создание поставщика');
    if (!newSupplier.trim()) {
      setErrors(prev => ({ ...prev, newSupplier: 'Введите название поставщика' }));
      return;
    }

    setCreatingSupplier(true);
    try {
      const createdSupplierId = await createSupplier(newSupplier.trim());
      await reload();
      setSupplierId(createdSupplierId);
      setNewSupplier('');
      setErrors(prev => ({ ...prev, newSupplier: undefined }));
    } catch (error) {
      console.error('❌ ProductModal Miller: Ошибка создания поставщика:', error);
      alert(`Ошибка создания поставщика: ${error.message}`);
    } finally {
      setCreatingSupplier(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!code.trim()) {
      newErrors.code = 'Артикул обязателен';
    }

    if (!name.trim()) {
      newErrors.name = 'Название продукта обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔄 ProductModal Miller: Начало отправки формы');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(
        code.trim(), 
        name.trim(), 
        description.trim(), 
        brandId || undefined, 
        supplierId || undefined
      );
    } catch (error) {
      console.error('❌ ProductModal Miller: Ошибка:', error);
      alert(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
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
          parentPath={parentPath}
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
    </div>
  );
}