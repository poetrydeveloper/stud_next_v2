//app/super-add/types.ts
export interface TreeNode {
  [key: string]: {
    type: string;
    path: string;
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
  onSubmit: (...args: any[]) => void;
}