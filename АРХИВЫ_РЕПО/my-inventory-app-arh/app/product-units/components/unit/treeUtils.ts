// app/product-units/components/unit/treeUtils.ts
export interface TreeNode {
  id: number;
  name: string;
  level: number;
  path: string;
  type: 'category' | 'spine';
  children: TreeNode[];
  spines?: any[];
  productUnits?: any[];
}

export function buildTreeFromHumanPath(categories: any[]): TreeNode[] {
  const root: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();
  
  categories.forEach(category => {
    const pathParts = category.human_path?.split(' / ').filter(Boolean) || [];
    const filteredParts = pathParts.filter(part => part !== 'structure');
    const level = filteredParts.length - 1;
    
    const node: TreeNode = {
      id: category.id,
      name: category.name,
      level,
      path: category.human_path || '',
      type: 'category',
      children: [],
      spines: category.spines || []
    };
    
    nodeMap.set(category.human_path || '', node);
    
    if (level === 0) {
      root.push(node);
    } else {
      const parentPath = filteredParts.slice(0, -1).join(' / ');
      const fullParentPath = 'structure / ' + parentPath;
      const parent = nodeMap.get(fullParentPath);
      if (parent) {
        parent.children.push(node);
      } else {
        root.push(node);
      }
    }
  });
  
  return root;
}