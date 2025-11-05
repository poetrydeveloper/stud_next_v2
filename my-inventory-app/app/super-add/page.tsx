// app/super-add/page.tsx
'use client';

import { useState, useEffect } from 'react';
//import TreeView from './components/TreeView';
import ImprovedTreeView from './components/ImprovedTreeView';
import CategoryModal from './components/CategoryModal';
import SpineModal from './components/SpineModal';
import ProductModal from './components/ProductModal/index'; // ← ИМПОРТ ИЗ ПАПКИ INDEX
import { TreeNode } from './types';

export default function SuperAddPage() {
  const [tree, setTree] = useState<TreeNode>({});
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [activeModal, setActiveModal] = useState<'category' | 'spine' | 'product' | null>(null);

  useEffect(() => {
    loadTree();
  }, []);

  const loadTree = async () => {
    try {
      const response = await fetch('/api/structure/tree');
      const data = await response.json();
      if (data.success) {
        setTree(data.tree);
      }
    } catch (error) {
      console.error('Ошибка загрузки дерева:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const response = await fetch('/api/structure/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          parentPath: selectedPath
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', result);
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }
      
      if (result.success) {
        setActiveModal(null);
        loadTree();
        alert('Категория успешно создана!');
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      console.error('Full error:', error);
      alert(`Ошибка создания категории: ${error.message}`);
    }
  };

  const handleCreateSpine = async (name: string) => {
    try {
      const response = await fetch('/api/structure/spine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentPath: selectedPath }),
      });
      
      const result = await response.json();
      if (result.success) {
        setActiveModal(null);
        loadTree();
        alert('Spine успешно создан!');
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      alert('Ошибка создания spine');
    }
  };

  const handleCreateProduct = async (
    code: string, 
    name: string, 
    description: string = '', 
    brandId?: number, 
    supplierId?: number,
    images?: File[] // ← ДОБАВЛЯЕМ ИЗОБРАЖЕНИЯ
  ) => {
    try {
      console.log('🔄 SuperAddPage: Создание продукта с изображениями', {
        code, name, imagesCount: images?.length || 0
      });

      // СОЗДАЕМ FORMDATA вместо JSON
      const formData = new FormData();
      formData.append('code', code);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('parentPath', selectedPath);
      
      if (brandId) formData.append('brandId', brandId.toString());
      if (supplierId) formData.append('supplierId', supplierId.toString());

      // ДОБАВЛЯЕМ ИЗОБРАЖЕНИЯ если есть
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', image);
        });
        console.log('📸 SuperAddPage: Добавлено изображений:', images.length);
      }

      const response = await fetch('/api/structure/product', {
        method: 'POST',
        // НЕ УКАЗЫВАЕМ Content-Type - браузер сам установит multipart/form-data
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setActiveModal(null);
        loadTree();
        alert('Продукт успешно создан!');
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ SuperAddPage: Ошибка создания продукта:', error);
      alert('Ошибка создания продукта');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Загрузка дерева...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Быстрое добавление товаров</h1>
      
      <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Структура каталога</h2>
          <button 
            onClick={loadTree}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
          >
            Обновить
          </button>
        </div>
        
        <ImprovedTreeView 
          tree={tree} 
          selectedPath={selectedPath}
          onSelect={setSelectedPath}
        />
      </div>

      <div className="flex gap-3 mb-6">
        <button 
          onClick={() => setActiveModal('category')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          + Создать категорию
        </button>
        <button 
          onClick={() => setActiveModal('spine')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          + Создать Spine
        </button>
        <button 
          onClick={() => {
            if (!selectedPath) {
              alert('❌ Сначала выберите категорию или spine в дереве!');
              return;
            }
            setActiveModal('product');
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          + Создать Продукт
        </button>
        
        {/* НОВАЯ КНОПКА - переход к продуктам */}
        <a
          href="/products"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          📦 Все продукты
        </a>
      </div>

      {selectedPath && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Выбрано:</span> {selectedPath}
          </p>
        </div>
      )}

      {activeModal === 'category' && (
        <CategoryModal 
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateCategory}
        />
      )}

      {activeModal === 'spine' && (
        <SpineModal 
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateSpine}
        />
      )}

      {activeModal === 'product' && (
        <ProductModal 
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateProduct}
          selectedPath={selectedPath}
        />
      )}
    </div>
  );
}