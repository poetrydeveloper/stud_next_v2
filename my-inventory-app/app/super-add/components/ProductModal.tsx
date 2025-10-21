//app/super-add/components/ProductModal.tsx
'use client';

import { useState } from 'react';
import { ModalProps } from '../types';

export default function ProductModal({ onClose, onSubmit }: ModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { code?: string; name?: string } = {};
    
    if (!code.trim()) {
      newErrors.code = 'Артикул обязателен';
    } else if (code.trim().length < 2) {
      newErrors.code = 'Артикул должен быть не менее 2 символов';
    } else if (code.trim().length > 20) {
      newErrors.code = 'Артикул должен быть не более 20 символов';
    }

    if (!name.trim()) {
      newErrors.name = 'Название продукта обязательно';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Название должно быть не менее 2 символов';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Название должно быть не более 100 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(code.trim(), name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Создать Продукт</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Артикул/Код"
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
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название продукта"
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
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}