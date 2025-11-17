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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Создать Spine
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Категория: <span className="font-medium">{category.name}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-4">
              <label htmlFor="spineName" className="block text-sm font-medium text-gray-700 mb-2">
                Название Spine *
              </label>
              <input
                id="spineName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Введите название spine"
                autoFocus
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
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