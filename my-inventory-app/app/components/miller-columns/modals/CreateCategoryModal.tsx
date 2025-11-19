// app/ components/ miller-columns/  modal/CreateCategoryModal.tsx - ПОЛНЫЙ ФИКС С АБСОЛЮТНЫМИ СТИЛЯМИ
'use client';

import { useState, useEffect } from 'react';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, parentId?: number) => Promise<void>;
  parentCategory?: {
    id: number;
    name: string;
  };
}

export default function CreateCategoryModal({ 
  isOpen, 
  onClose, 
  onCreate, 
  parentCategory 
}: CreateCategoryModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('🎯 CreateCategoryModal MOUNTED:', { isOpen, parentCategory: parentCategory?.name });
  }, []);

  useEffect(() => {
    console.log('🎯 CreateCategoryModal UPDATED:', { isOpen, parentCategory: parentCategory?.name });
  }, [isOpen, parentCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      console.log('🎯 SUBMITTING category:', { name, parentId: parentCategory?.id });
      await onCreate(name, parentCategory?.id);
      setName('');
      onClose();
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Ошибка при создании категории');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    console.log('🎯 CLOSING category modal');
    setName('');
    onClose();
  };

  console.log('🎯 CreateCategoryModal RENDER:', { isOpen, parentCategory: parentCategory?.name });

  if (!isOpen) {
    console.log('🎯 CreateCategoryModal NOT RENDERING because !isOpen');
    return null;
  }

  console.log('🎯 CreateCategoryModal RENDERING MODAL - SHOULD BE VISIBLE NOW!');

  return (
    <div 
      style={{ 
        // АБСОЛЮТНЫЕ СТИЛИ БЕЗ TAILWIND
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1rem',
        border: '10px solid red'
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          width: '100%',
          maxWidth: '28rem',
          border: '5px solid blue'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
            🚨 СОЗДАТЬ КАТЕГОРИЮ - ВИДИМАЯ МОДАЛКА
          </h2>
          {parentCategory && (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Родительская категория: <span style={{ fontWeight: '500' }}>{parentCategory.name}</span>
            </p>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="categoryName" 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}
              >
                Название категории *
              </label>
              <input
                id="categoryName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  outline: 'none'
                }}
                placeholder="Введите название категории"
                autoFocus
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '0.75rem', 
            padding: '1rem 1.5rem 1.5rem',
            backgroundColor: '#f9fafb',
            borderBottomLeftRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem'
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '0.375rem'
              }}
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? 'Создание...' : 'Создать категорию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}