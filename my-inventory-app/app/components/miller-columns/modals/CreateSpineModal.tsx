//app/ components/ miller-columns/  modal/ CreateSpineModal.tsx
'use client';

import { useState } from 'react';

interface CreateSpineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, categoryId: number) => Promise<void>;
  category: {
    id: number;
    name: string;
  };
}

export default function CreateSpineModal({ 
  isOpen, 
  onClose, 
  onCreate, 
  category 
}: CreateSpineModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await onCreate(name, category.id);
      setName('');
      onClose();
    } catch (error) {
      console.error('Error creating spine:', error);
      alert('Ошибка при создании spine');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{ 
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
        border: '10px solid green'
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          width: '100%',
          maxWidth: '28rem',
          border: '5px solid darkgreen'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
            🚨 СОЗДАТЬ SPINE - ВИДИМАЯ МОДАЛКА
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Категория: <span style={{ fontWeight: '500' }}>{category.name}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="spineName" 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}
              >
                Название Spine *
              </label>
              <input
                id="spineName"
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
                placeholder="Введите название spine"
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
                backgroundColor: '#16a34a',
                border: 'none',
                borderRadius: '0.375rem'
              }}
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? 'Создание...' : 'Создать Spine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}