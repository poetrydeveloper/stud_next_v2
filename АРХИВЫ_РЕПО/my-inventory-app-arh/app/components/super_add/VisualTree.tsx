//VisualTree.tsx
"use client";

import { useState, useEffect } from "react";
import { CategoryNode, SelectedNode } from "../../types/super-add";
import TreeNode from "./TreeNode";
import { useTreeExpansion } from "./hooks/useTreeExpansion";

interface VisualTreeProps {
  onNodeSelect: (node: SelectedNode) => void;
  selectedNode: SelectedNode | null;
}

export default function VisualTree({ onNodeSelect, selectedNode }: VisualTreeProps) {
  const [treeData, setTreeData] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const { isNodeExpanded, toggleNode } = useTreeExpansion();

  useEffect(() => {
    loadTreeData();
  }, []);

  const loadTreeData = async () => {
    try {
      setLoading(true);
      
      // Загружаем дерево категорий с вложенностью
      const categoriesRes = await fetch('/api/categories/tree');
      const categoriesData = await categoriesRes.json();
      
      if (categoriesData.ok) {
        console.log("📊 Загружено дерево категорий:", categoriesData.data);
        setTreeData(categoriesData.data || []);
      } else {
        console.error("❌ Ошибка загрузки дерева категорий");
        setTreeData([]);
      }
    } catch (error) {
      console.error("Ошибка загрузки дерева:", error);
      setTreeData([]);
    } finally {
      setLoading(false);
    }
  };

  // Функция для передачи полных данных узла
  const handleNodeSelect = (nodeData: any, type: 'category' | 'spine' | 'product') => {
    const selectedNode: SelectedNode = {
      type,
      id: nodeData.id,
      name: nodeData.name,
      data: nodeData // ← ВАЖНО: передаем ВСЕ данные узла
    };
    onNodeSelect(selectedNode);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0' }}>
        <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Загрузка дерева...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {treeData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6b7280' }}>
          Нет данных. Создайте первую категорию.
        </div>
      ) : (
        treeData.map((category) => (
          <TreeNode
            key={`category-${category.id}`}
            node={category}
            type="category"
            depth={0}
            onNodeSelect={handleNodeSelect} // ← Используем исправленную функцию
            selectedNode={selectedNode}
            isExpanded={isNodeExpanded}
            onToggle={toggleNode}
          />
        ))
      )}
    </div>
  );
}