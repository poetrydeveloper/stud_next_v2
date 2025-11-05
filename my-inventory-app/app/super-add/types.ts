// app/super-add/types.ts
export interface TreeNode {
  [key: string]: {
    type: string;
    path: string;
    name: string;
    children: TreeNode;
  };
}

export interface TreeViewProps {
  tree: TreeNode;
  selectedPath: string;
  onSelect: (path: string) => void;
}

export interface ModalProps {
  onClose: () => void;
  onSubmit: (
    code: string, 
    name: string, 
    description?: string, 
    brandId?: number, 
    supplierId?: number,
    images?: File[] // ← ДОБАВЛЯЕМ ИЗОБРАЖЕНИЯ
  ) => Promise<void>;
}

export interface HorizontalTreeNode {
  technicalName: string;
  russianName: string;
  type: 'category' | 'spine' | 'product';
  path: string;
  children: HorizontalTreeNode[];
  level: number;
  x: number; // Позиция по X для отрисовки
  y: number; // Позиция по Y для отрисовки
}

export interface HorizontalTreeViewProps {
  tree: TreeNode;
  selectedPath: string;
  onSelect: (path: string) => void;
}