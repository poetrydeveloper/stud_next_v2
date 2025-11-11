// components/MillerColumns/FullDataMillerColumns.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Column } from './Column/Column';
import { useTreeData } from './hooks/useTreeData';
import { CategoryModal } from './modals/CategoryModal';
import { SpineModal } from './modals/SpineModal';
import { ProductModal } from './modals/ProductModal';
import { ProductUnitsModal } from './modals/ProductUnitsModal';
import { QuickRequestPanel } from './panels/QuickRequestPanel';
import styles from './MillerColumns.module.css';

type TreeNode = {
  id: number;
  name: string;
  path: string;
  type: 'category' | 'spine' | 'product';
  hasChildren: boolean;
  children?: TreeNode[];
  spines?: TreeNode[];
  products?: TreeNode[];
  code?: string;
  brand?: string;
};

type Props = { 
  initialData: TreeNode[];
};

type ModalType = 'category' | 'spine' | 'product' | 'productUnits' | null;

export function FullDataMillerColumns({ initialData }: Props) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [isRequestPanelOpen, setIsRequestPanelOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  
  const {
    columns,
    selectedPath,
    handleSelect,
    refreshData,
    handleCreateCategory,
    handleCreateSpine,
    handleCreateProduct,
    getParentNodeForColumn
  } = useTreeData(initialData);

  // ДИАГНОСТИКА: что пришло с бэкенда
  console.log('🔍 Frontend - initialData from API:', {
    dataLength: initialData.length,
    nodeTypes: initialData.map(item => item.type),
    firstNode: initialData[0] ? {
      name: initialData[0].name,
      type: initialData[0].type,
      hasChildren: initialData[0].hasChildren,
      childrenCount: initialData[0].children?.length || 0,
      childrenTypes: initialData[0].children?.map(c => `${c.type}:${c.name}`)
    } : 'No data'
  });

  // ДИАГНОСТИКА: структура колонок
  console.log('🔍 Frontend - Columns structure:', {
    columnsCount: columns.length,
    selectedPath,
    columns: columns.map((col, index) => ({
      column: index,
      nodes: col.length,
      types: col.map(node => `${node.type}:${node.name}`)
    }))
  });

  // Авто-прокрутка к последней колонке при изменении columns
  useEffect(() => {
    if (scrollerRef.current && columns.length > 0) {
      const scrollToEnd = () => {
        if (scrollerRef.current) {
          scrollerRef.current.scrollLeft = scrollerRef.current.scrollWidth;
        }
      };
      
      // Небольшая задержка для гарантии что DOM обновился
      setTimeout(scrollToEnd, 50);
    }
  }, [columns.length]);

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedNode(null);
  };

  const handleNodeSelect = (node: TreeNode, columnIndex: number) => {
    console.log('🖱️ Node clicked:', {
      name: node.name,
      type: node.type, 
      hasChildren: node.hasChildren,
      path: node.path,
      columnIndex,
      currentSelectedPath: selectedPath
    });
    
    // ДИАГНОСТИКА: проверяем детей узла
    if (node.hasChildren) {
      console.log('🔍 Node children:', {
        childrenCount: node.children?.length || 0,
        children: node.children?.map(c => `${c.type}:${c.name}`)
      });
    }
    
    if (node.type === 'product') {
      setSelectedNode(node);
      setActiveModal('productUnits');
    } else {
      handleSelect(node, columnIndex);
    }
  };

  const handleOpenRequestPanel = () => {
    if (!selectedNode || selectedNode.type !== 'product') {
      alert('Выберите продукт для создания заявки');
      return;
    }
    setIsRequestPanelOpen(true);
  };

  const getProductData = (node: TreeNode | null) => {
    if (!node || node.type !== 'product') return undefined;
    
    return {
      id: node.id,
      name: node.name,
      code: node.code || 'N/A'
    };
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.controlPanel}>
        <button
          onClick={handleOpenRequestPanel}
          className={styles.requestBtn}
          disabled={!selectedNode || selectedNode.type !== 'product'}
        >
          📋 Быстрая заявка
        </button>
        
        <button
          onClick={refreshData}
          className={styles.refreshBtn}
        >
          🔄 Обновить
        </button>
      </div>

      <div ref={scrollerRef} className={styles.scroller}>
        {columns.map((nodes, columnIndex) => {
          const parentNode = getParentNodeForColumn(columnIndex);
          
          return (
            <Column
              key={`column-${columnIndex}-${nodes.length}`}
              nodes={nodes}
              columnIndex={columnIndex}
              selectedPath={selectedPath}
              onSelect={handleNodeSelect}
              parentNodeType={parentNode?.type}
              onCreateCategory={() => setActiveModal('category')}
              onCreateSpine={() => setActiveModal('spine')}
              onCreateProduct={() => setActiveModal('product')}
            />
          );
        })}
      </div>

      {activeModal === 'category' && (
        <CategoryModal
          onClose={handleCloseModal}
          onSubmit={handleCreateCategory}
          parentPath={selectedPath.join('/')}
        />
      )}

      {activeModal === 'spine' && (
        <SpineModal
          onClose={handleCloseModal}
          onSubmit={handleCreateSpine}
          parentPath={selectedPath.join('/')}
        />
      )}

      {activeModal === 'product' && (
        <ProductModal
          onClose={handleCloseModal}
          onSubmit={handleCreateProduct}
          parentPath={selectedPath.join('/')}
        />
      )}

      {activeModal === 'productUnits' && selectedNode && (
        <ProductUnitsModal
          onClose={handleCloseModal}
          product={getProductData(selectedNode)!}
        />
      )}

      <QuickRequestPanel
        isOpen={isRequestPanelOpen}
        onClose={() => setIsRequestPanelOpen(false)}
        selectedProduct={getProductData(selectedNode)}
      />
    </div>
  );
}