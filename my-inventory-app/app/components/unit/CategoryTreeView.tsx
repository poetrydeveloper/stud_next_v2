// app/product-units/components/unit/CategoryTreeView.tsx
"use client";

import { useState } from "react";
import { buildTreeFromHumanPath, TreeNode } from "./treeUtils";
import CategoryNode from "../../product-units/components/unit/CategoryNode";

interface CategoryTreeViewProps {
  categories: any[];
}

export default function CategoryTreeView({ categories }: UnitTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  const toggleNode = (nodeId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.has(nodeId) ? newSet.delete(nodeId) : newSet.add(nodeId);
      return newSet;
    });
  };

  const tree = buildTreeFromHumanPath(categories, []);

  return (
    <div className="max-h-screen overflow-y-auto space-y-2">
      {tree.map(node => (
        <CategoryNode
          key={`${node.type}-${node.id}`}
          node={node}
          expandedNodes={expandedNodes}
          onToggle={toggleNode}
        />
      ))}
    </div>
  );
}