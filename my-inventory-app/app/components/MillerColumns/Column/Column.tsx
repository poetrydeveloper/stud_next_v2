// components/MillerColumns/Column/Column.tsx
import { ColumnHeader } from './ColumnHeader';
import styles from '../MillerColumns.module.css';

type TreeNode = {
  id: number;
  name: string;
  path: string;
  type: 'category' | 'spine' | 'product';
  hasChildren: boolean;
  code?: string;
  brand?: string;
};

type ColumnProps = {
  nodes: TreeNode[];
  columnIndex: number;
  selectedPath: string[];
  onSelect: (node: TreeNode, columnIndex: number) => void;
  onCreateCategory: () => void;
  onCreateSpine: () => void;
  onCreateProduct: () => void;
  parentNodeType?: 'category' | 'spine' | 'product';
};

export function Column({ 
  nodes, 
  columnIndex, 
  selectedPath, 
  onSelect,
  onCreateCategory,
  onCreateSpine,
  onCreateProduct,
  parentNodeType
}: ColumnProps) {
  const getRowClass = (node: TreeNode) => {
    const baseClass = styles.row;
    const isSelected = selectedPath[columnIndex] === node.path;
    
    if (isSelected) return `${baseClass} ${styles.selectedRow}`;
    if (node.type === 'spine') return `${baseClass} ${styles.spineRow}`;
    if (node.type === 'product') return `${baseClass} ${styles.productRow}`;
    return baseClass;
  };

  const showArrow = (node: TreeNode) => {
    if (node.type === 'product') return false;
    return node.hasChildren;
  };

  const getNodeIcon = (node: TreeNode) => {
    switch (node.type) {
      case 'category': return '📁';
      case 'spine': return '🌿';
      case 'product': return '📦';
      default: return '❓';
    }
  };

  return (
    <div className={styles.column}>
      <ColumnHeader 
        columnIndex={columnIndex}
        parentNodeType={parentNodeType}
        onCreateCategory={onCreateCategory}
        onCreateSpine={onCreateSpine}
        onCreateProduct={onCreateProduct}
      />
      
      <ul className={styles.list}>
        {nodes.map(node => (
          <li
            key={`${node.type}-${node.id}-${node.path}`}
            className={getRowClass(node)}
            onClick={() => onSelect(node, columnIndex)}
          >
            <span className={styles.label}>
              {getNodeIcon(node)} {node.name}
              {node.type === 'product' && node.code && ` (${node.code})`}
            </span>

            {showArrow(node) && (
              <span className={styles.arrow}>›</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}