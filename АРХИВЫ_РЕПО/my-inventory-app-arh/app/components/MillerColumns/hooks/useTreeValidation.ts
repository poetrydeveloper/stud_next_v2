// components/MillerColumns/hooks/useTreeValidation.ts
type TreeNode = {
  id: number;
  name: string;
  path: string;
  type: 'category' | 'spine' | 'product';
  hasChildren: boolean;
  children?: TreeNode[];
  spines?: TreeNode[];
  products?: TreeNode[];
};

type ValidationError = {
  type: 'UNIQUE_NAME' | 'MAX_DEPTH' | 'INVALID_PARENT';
  message: string;
};

export function useTreeValidation() {
  
  const validateUniqueName = (
    nodes: TreeNode[], 
    name: string
  ): ValidationError | null => {
    const existingNames = nodes.map(node => node.name.toLowerCase());
    
    if (existingNames.includes(name.toLowerCase())) {
      return {
        type: 'UNIQUE_NAME',
        message: `Элемент с именем "${name}" уже существует на этом уровне`
      };
    }
    
    return null;
  };

  const validateMaxDepth = (
    selectedPath: string[]
  ): ValidationError | null => {
    // Максимальная глубина: 4 уровня (Категория → Категория → Spine → Product)
    if (selectedPath.length >= 4) {
      return {
        type: 'MAX_DEPTH',
        message: 'Достигнута максимальная глубина дерева (4 уровня)'
      };
    }
    
    return null;
  };

  const validateParentType = (
    parentNode: TreeNode | undefined,
    childType: 'category' | 'spine' | 'product'
  ): ValidationError | null => {
    // Если нет родителя (корень) - можно создавать только категории
    if (!parentNode) {
      if (childType !== 'category') {
        return {
          type: 'INVALID_PARENT',
          message: 'В корне можно создавать только категории'
        };
      }
      return null;
    }

    // Правила создания:
    // - Категории можно создавать только в категориях
    // - Spine можно создавать ТОЛЬКО в категориях  
    // - Products можно создавать ТОЛЬКО в spine
    if (childType === 'category' && parentNode.type !== 'category') {
      return {
        type: 'INVALID_PARENT',
        message: 'Категории можно создавать только внутри других категорий'
      };
    }

    if (childType === 'spine' && parentNode.type !== 'category') {
      return {
        type: 'INVALID_PARENT',
        message: 'Spine можно создавать только внутри категорий'
      };
    }

    if (childType === 'product' && parentNode.type !== 'spine') {
      return {
        type: 'INVALID_PARENT',
        message: 'Продукты можно создавать только внутри spine'
      };
    }

    return null;
  };

  const validateCreateNode = (
    nodes: TreeNode[],
    name: string,
    selectedPath: string[],
    parentNode: TreeNode | undefined,
    nodeType: 'category' | 'spine' | 'product'
  ): ValidationError | null => {
    
    // Проверка уникальности имени
    const uniqueError = validateUniqueName(nodes, name);
    if (uniqueError) return uniqueError;

    // Проверка максимальной глубины (только для категорий и spine)
    if (nodeType !== 'product') {
      const depthError = validateMaxDepth(selectedPath);
      if (depthError) return depthError;
    }

    // Проверка типа родителя
    const parentError = validateParentType(parentNode, nodeType);
    if (parentError) return parentError;

    return null;
  };

  return {
    validateCreateNode,
    validateUniqueName,
    validateMaxDepth,
    validateParentType
  };
}