"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VisualTree from "@/app/components/super_add/VisualTree";
import SuperAddWizard from "@/app/components/super_add/SuperAddWizard";
import { SelectedNode } from "../types/super-add";

export default function SuperAddPage() {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardMode, setWizardMode] = useState<'category' | 'spine' | 'product' | null>(null);
  const [refreshTree, setRefreshTree] = useState(0); // Для принудительного обновления дерева

  // Обработчики создания сущностей
  const handleCreateCategory = () => {
    setWizardMode('category');
    setShowWizard(true);
  };

  const handleCreateSpine = () => {
    if (!selectedNode || selectedNode.type !== 'category') {
      alert("Сначала выберите категорию для создания Spine");
      return;
    }
    setWizardMode('spine');
    setShowWizard(true);
  };

  const handleCreateProduct = () => {
    if (!selectedNode || (selectedNode.type !== 'category' && selectedNode.type !== 'spine')) {
      alert("Сначала выберите категорию или Spine для создания товара");
      return;
    }
    setWizardMode('product');
    setShowWizard(true);
  };

  const handleWizardClose = () => {
    setShowWizard(false);
    setWizardMode(null);
  };

  const handleWizardSuccess = () => {
    setShowWizard(false);
    setWizardMode(null);
    // Принудительно обновляем дерево после успешного создания
    setRefreshTree(prev => prev + 1);
    alert("Успешно создано!");
  };

  // Функция для обновления выбранного узла с правильными типами
  const handleNodeSelect = (node: SelectedNode) => {
    setSelectedNode(node);
  };

  // Получение информации о выбранном узле для отображения
  const getSelectedNodeInfo = () => {
    if (!selectedNode) return null;

    const baseInfo = `Выбрано: ${selectedNode.name}`;
    
    switch (selectedNode.type) {
      case 'category':
        return `${baseInfo} (📁 Категория)`;
      case 'spine':
        return `${baseInfo} (🔷 Spine)`;
      case 'product':
        const productInfo = selectedNode.data as any;
        return `${baseInfo} (🟢 Товар${productInfo?.code ? ` - ${productInfo.code}` : ''})`;
      default:
        return baseInfo;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SUPER ADD</h1>
          <p className="text-gray-600 mt-2">
            Быстрое создание товаров с визуальным деревом категорий
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          Назад
        </button>
      </div>

      {/* Панель управления */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="font-medium text-gray-700">Создать:</span>
          
          <button
            onClick={handleCreateCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            📁 Категорию
          </button>
          
          <button
            onClick={handleCreateSpine}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            disabled={!selectedNode || selectedNode.type !== 'category'}
          >
            🔷 Spine
          </button>
          
          <button
            onClick={handleCreateProduct}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            disabled={!selectedNode || selectedNode.type === 'product'}
          >
            🟢 Товар
          </button>

          {/* Информация о выбранном узле */}
          {selectedNode && (
            <div className="ml-4 px-3 py-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
              <div className="font-medium text-yellow-800">
                {getSelectedNodeInfo()}
              </div>
              {/* Дополнительная информация о node_index если есть */}
              {selectedNode.data?.node_index && (
                <div className="text-xs text-yellow-600 mt-1">
                  ID: {selectedNode.data.node_index}
                </div>
              )}
            </div>
          )}

          {/* Кнопка обновления дерева */}
          <button
            onClick={() => setRefreshTree(prev => prev + 1)}
            className="ml-auto bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm"
          >
            🔄 Обновить дерево
          </button>
        </div>
      </div>

      {/* Визуальное дерево */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Дерево структуры</h2>
          <div className="text-sm text-gray-500">
            {selectedNode ? `Выбран: ${selectedNode.name}` : 'Выберите узел для действий'}
          </div>
        </div>
        <VisualTree 
          key={refreshTree} // Принудительное обновление при изменении
          onNodeSelect={handleNodeSelect}
          selectedNode={selectedNode}
        />
      </div>

      {/* Мастер создания */}
      {showWizard && wizardMode && (
        <SuperAddWizard
          mode={wizardMode}
          selectedNode={selectedNode}
          onClose={handleWizardClose}
          onSuccess={handleWizardSuccess}
        />
      )}
    </div>
  );
}