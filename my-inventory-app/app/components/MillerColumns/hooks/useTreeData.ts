// components/MillerColumns/hooks/useTreeData.ts
import { useState, useMemo, useCallback } from 'react';
import { useTreeValidation } from './useTreeValidation';

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

export function useTreeData(initialData: TreeNode[]) {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { validateCreateNode } = useTreeValidation();

  const refreshData = () => setRefreshTrigger(prev => prev + 1);

  const getChildren = useCallback((node: TreeNode): TreeNode[] => {
    if (node.type === 'category') {
      return [...(node.children || []), ...(node.spines || [])];
    } else if (node.type === 'spine') {
      return node.products || [];
    }
    return [];
  }, []);

  const findParentNode = useCallback((): TreeNode | undefined => {
    if (selectedPath.length === 0) return undefined;
    
    let currentLevel = initialData;
    let parentNode: TreeNode | undefined;
    
    for (const pathSegment of selectedPath) {
      parentNode = currentLevel.find(node => node.path === pathSegment);
      if (!parentNode) break;
      currentLevel = getChildren(parentNode);
    }
    
    return parentNode;
  }, [initialData, selectedPath, getChildren]);

  const getCurrentLevelNodes = useCallback((): TreeNode[] => {
    if (selectedPath.length === 0) return initialData;
    
    let currentLevel = initialData;
    for (const pathSegment of selectedPath) {
      const node = currentLevel.find(n => n.path === pathSegment);
      if (!node) break;
      currentLevel = getChildren(node);
    }
    
    return currentLevel;
  }, [initialData, selectedPath, getChildren]);

  const getParentNodeForColumn = useCallback((columnIndex: number): TreeNode | undefined => {
    if (columnIndex === 0) return undefined;
    
    let currentLevel = initialData;
    let parentNode: TreeNode | undefined;
    
    for (let i = 0; i < columnIndex; i++) {
      const pathSegment = selectedPath[i];
      parentNode = currentLevel.find(node => node.path === pathSegment);
      if (!parentNode) break;
      currentLevel = getChildren(parentNode);
    }
    
    return parentNode;
  }, [initialData, selectedPath, getChildren]);

  const columns = useMemo(() => {
    const result: TreeNode[][] = [initialData];
    
    let currentLevel = initialData;
    
    for (const pathSegment of selectedPath) {
      const nextNode = currentLevel.find(node => node.path === pathSegment);
      if (nextNode) {
        const children = getChildren(nextNode);
        if (children.length > 0) {
          result.push(children);
          currentLevel = children;
        }
      }
    }
    
    return result;
  }, [initialData, selectedPath, getChildren, refreshTrigger]);

  const handleSelect = (node: TreeNode, columnIndex: number) => {
    const newPath = selectedPath.slice(0, columnIndex);
    if (node.hasChildren && node.type !== 'product') {
      newPath.push(node.path);
    }
    setSelectedPath(newPath);
  };

  const handleCreateCategory = async (name: string, parentPath: string) => {
    const currentNodes = getCurrentLevelNodes();
    const parentNode = findParentNode();
    
    const validationError = validateCreateNode(
      currentNodes,
      name,
      selectedPath,
      parentNode,
      'category'
    );
    
    if (validationError) {
      alert(validationError.message);
      return;
    }

    try {
      const response = await fetch('/api/structure/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentPath }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        refreshData();
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      alert('Ошибка создания категории');
    }
  };

  const handleCreateSpine = async (name: string, parentPath: string) => {
    const currentNodes = getCurrentLevelNodes();
    const parentNode = findParentNode();
    
    const validationError = validateCreateNode(
      currentNodes,
      name,
      selectedPath,
      parentNode,
      'spine'
    );
    
    if (validationError) {
      alert(validationError.message);
      return;
    }

    try {
      const response = await fetch('/api/structure/spine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentPath }),
      });
      
      const result = await response.json();
      if (result.success) {
        refreshData();
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      alert('Ошибка создания spine');
    }
  };

  const handleCreateProduct = async (code: string, name: string, description?: string) => {
    const currentNodes = getCurrentLevelNodes();
    const parentNode = findParentNode();
    
    const validationError = validateCreateNode(
      currentNodes,
      name,
      selectedPath,
      parentNode,
      'product'
    );
    
    if (validationError) {
      alert(validationError.message);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('code', code);
      formData.append('name', name);
      formData.append('description', description || '');
      formData.append('parentPath', selectedPath.join('/'));

      const response = await fetch('/api/structure/product', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        refreshData();
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      alert('Ошибка создания продукта');
    }
  };

  return {
    columns,
    selectedPath,
    handleSelect,
    refreshData,
    handleCreateCategory,
    handleCreateSpine,
    handleCreateProduct,
    findParentNode,
    getCurrentLevelNodes,
    getParentNodeForColumn
  };
}