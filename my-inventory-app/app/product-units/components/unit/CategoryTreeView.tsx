// app/product-units/components/unit/CategoryTreeView.tsx
"use client";
import { useState, useEffect } from "react";
import { buildTreeFromHumanPath } from "./treeUtils";
import CategoryNode from "./CategoryNode";

export default function CategoryTreeView({ categories }: any) {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [tree, setTree] = useState<any[]>([]);

  useEffect(() => {
    const builtTree = buildTreeFromHumanPath(categories);
    setTree(builtTree);
    if (builtTree.length > 0) {
      setExpandedNodes(new Set([builtTree[0].id]));
    }
  }, [categories]);

  const toggleNode = (nodeId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.has(nodeId) ? newSet.delete(nodeId) : newSet.add(nodeId);
      return newSet;
    });
  };

  if (tree.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🌳</div>
        <p>Дерево категорий пустое</p>
        <div className="text-sm mt-2 space-y-1">
          <p>Загружено категорий: {categories.length}</p>
          <p>Spine: {categories.reduce((sum: number, cat: any) => sum + cat.spines.length, 0)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen overflow-y-auto space-y-2">
      {tree.map(node => (
        <CategoryNode key={`${node.type}-${node.id}`} node={node} expandedNodes={expandedNodes} onToggle={toggleNode} />
      ))}
    </div>
  );
}