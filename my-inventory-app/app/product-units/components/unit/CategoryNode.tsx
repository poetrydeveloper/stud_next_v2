// app/product-units/components/unit/CategoryNode.tsx
"use client";
import { TreeNode } from "./treeUtils";
import CategoryHeader from "./CategoryHeader";
import SpineNode from "./SpineNode";

interface CategoryNodeProps {
  node: TreeNode;
  expandedNodes: Set<number>;
  onToggle: (nodeId: number) => void;
}

export default function CategoryNode({ node, expandedNodes, onToggle }: CategoryNodeProps) {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children.length > 0;

  return (
    <div className={`${node.level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
      <CategoryHeader node={node} isExpanded={isExpanded} onToggle={() => onToggle(node.id)} />
      {isExpanded && (
        <div className="mt-2 space-y-2">
          {node.children.filter(child => child.type === 'category').map(child => (
            <CategoryNode key={`category-${child.id}`} node={child} expandedNodes={expandedNodes} onToggle={onToggle} />
          ))}
          {node.spines?.map(spine => (
            <SpineNode key={`spine-${spine.id}`} spine={spine} level={node.level + 1} />
          ))}
          {node.children.filter(child => child.type === 'spine').map(child => (
            <SpineNode key={`spine-${child.id}`} spine={child} level={node.level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}