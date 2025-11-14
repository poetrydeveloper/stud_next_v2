// components/MillerColumns/FullDataMillerColumns.tsx
'use client';

import { useState } from 'react';
import { Column } from './Column/Column';
import { useTreeData } from './hooks/useTreeData';
import { CategoryModal } from './modals/CategoryModal';
import { SpineModal } from './modals/SpineModal';
import { ProductModal } from './modals/ProductModal';
import { ProductUnitsModal } from './modals/ProductUnitsModal';
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
};

type Props = { 
  initialData: TreeNode[];
};

type ModalType = 'category' | 'spine' | 'product' | 'productUnits' | null;

export function FullDataMillerColumns({ initialData }: Props) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  
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

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedNode(null);
  };

  const handleNodeSelect = (node: TreeNode, columnIndex: number) => {
    // Для продуктов открываем модалку с product_units
    if (node.type === 'product') {
      setSelectedNode(node);
      setActiveModal('productUnits');
    } else {
      // Для категорий и spine'ов - навигация
      handleSelect(node, columnIndex);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroller}>
        {columns.map((nodes, columnIndex) => {
          const parentNode = getParentNodeForColumn(columnIndex);
          
          return (
            <Column
              key={`column-${columnIndex}`}
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

      {/* Модальные окна */}
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
          product={selectedNode}
        />
      )}
    </div>
  );
}