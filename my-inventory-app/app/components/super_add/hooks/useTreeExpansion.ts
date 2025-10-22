import { useState } from "react";

export function useTreeExpansion() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeType: string, nodeId: number) => {
    const nodeKey = `${nodeType}-${nodeId}`;
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeKey)) {
      newExpanded.delete(nodeKey);
    } else {
      newExpanded.add(nodeKey);
    }
    setExpandedNodes(newExpanded);
  };

  const isNodeExpanded = (nodeType: string, nodeId: number) => {
    return expandedNodes.has(`${nodeType}-${nodeId}`);
  };

  return { isNodeExpanded, toggleNode };
}