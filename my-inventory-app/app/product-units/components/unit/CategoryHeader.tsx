// app/product-units/components/unit/CategoryHeader.tsx
"use client";
import { TreeNode } from "./treeUtils";
import StatusStats from "./StatusStats";

interface CategoryHeaderProps {
  node: TreeNode;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function CategoryHeader({ node, isExpanded, onToggle }: CategoryHeaderProps) {
  const totalUnits = node.spines?.reduce((sum, spine) => sum + (spine.productUnits?.length || 0), 0) || 0;
  const getLevelColor = (level: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
    return colors[level % colors.length] || 'bg-gray-500';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggle}>
      <div className="flex items-center space-x-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${getLevelColor(node.level)}`}>{node.level + 1}</div>
        <div>
          <h3 className="font-semibold text-gray-900">{node.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <span>{node.spines?.length || 0} Spine</span>
            <span>{totalUnits} единиц</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <StatusStats spines={node.spines || []} />
        <span className="text-sm text-gray-500">{isExpanded ? '▲' : '▼'}</span>
      </div>
    </div>
  );
}