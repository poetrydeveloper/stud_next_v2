//TreeNode.tsx
"use client";

import { useState, useEffect } from "react";
import { SpineNode, ProductNode } from "../../types/super-add";

interface TreeNodeProps {
  node: any;
  type: 'category' | 'spine' | 'product';
  depth: number;
  onNodeSelect: (node: any) => void;
  selectedNode: any;
  isExpanded: (type: string, id: number) => boolean;
  onToggle: (type: string, id: number) => void;
}

export default function TreeNode({ 
  node, 
  type, 
  depth, 
  onNodeSelect, 
  selectedNode, 
  isExpanded, 
  onToggle 
}: TreeNodeProps) {
  const [children, setChildren] = useState<any[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const expanded = isExpanded(type, node.id);
  const isSelected = selectedNode?.type === type && selectedNode.id === node.id;

  useEffect(() => {
    // Для spine загружаем продукты при раскрытии
    if (expanded && type === 'spine' && children.length === 0) {
      loadSpineProducts();
    }
    
    // Для категорий загружаем spines при раскрытии (если их еще нет)
    if (expanded && type === 'category' && !node.spines && !node.children) {
      loadCategorySpines();
    }
  }, [expanded]);

  const loadSpineProducts = async () => {
    setLoadingChildren(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/products?spineId=${node.id}`);
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const text = await res.text();
      if (!text) throw new Error('Empty response from server');
      
      const data = JSON.parse(text);
      setChildren(data.ok ? data.data : []);
    } catch (error) {
      console.error("Ошибка загрузки продуктов:", error);
      setLoadError(error instanceof Error ? error.message : 'Unknown error');
      setChildren([]);
    } finally {
      setLoadingChildren(false);
    }
  };

  const loadCategorySpines = async () => {
    setLoadingChildren(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/spines/category/${node.id}`);
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const text = await res.text();
      if (!text) throw new Error('Empty response from server');
      
      const data = JSON.parse(text);
      // Сохраняем spines в node для повторного использования
      node.spines = data.ok ? data.data : [];
    } catch (error) {
      console.error("Ошибка загрузки spines:", error);
      setLoadError(error instanceof Error ? error.message : 'Unknown error');
      node.spines = [];
    } finally {
      setLoadingChildren(false);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(type, node.id);
  };

  const handleSelect = () => {
    onNodeSelect({ type, id: node.id, name: node.name, data: node });
  };

  const getNodeStyles = () => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem',
      cursor: 'pointer',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      transition: 'all 0.2s',
      marginLeft: `${depth * 24}px`,
    };

    const hoverStyles: React.CSSProperties = { backgroundColor: '#f9fafb' };
    const selectedStyles: React.CSSProperties = { border: '2px solid' };

    switch (type) {
      case 'category':
        selectedStyles.backgroundColor = '#dbeafe';
        selectedStyles.borderColor = '#93c5fd';
        break;
      case 'spine':
        selectedStyles.backgroundColor = '#f3e8ff';
        selectedStyles.borderColor = '#d8b4fe';
        break;
      case 'product':
        selectedStyles.backgroundColor = '#dcfce7';
        selectedStyles.borderColor = '#86efac';
        break;
    }

    return { ...baseStyles, ...(isSelected ? selectedStyles : {}), ...hoverStyles };
  };

  const getIconStyles = () => {
    const baseStyles: React.CSSProperties = {
      width: '2rem',
      height: '2rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '0.75rem'
    };

    switch (type) {
      case 'category': return { ...baseStyles, backgroundColor: '#dbeafe' };
      case 'spine': return { ...baseStyles, backgroundColor: '#f3e8ff' };
      case 'product': return { ...baseStyles, backgroundColor: '#dcfce7' };
      default: return { ...baseStyles, backgroundColor: '#f3f4f6' };
    }
  };

  const getLabelText = () => {
    switch (type) {
      case 'category': return 'Категория';
      case 'spine': return 'Spine';
      case 'product': return 'Товар';
      default: return 'Элемент';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'category': return '📁';
      case 'spine': return '🔷';
      case 'product': return '🟢';
      default: return '📄';
    }
  };

  // Определяем есть ли дети у узла
  const hasChildren = 
    (type === 'category' && (node.children?.length > 0 || node.spines || true)) || 
    (type === 'spine');

  return (
    <>
      <div style={getNodeStyles()} onClick={handleSelect}>
        {hasChildren && (
          <button 
            onClick={handleToggle}
            style={toggleButtonStyles}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {expanded ? '▼' : '►'}
          </button>
        )}
        {!hasChildren && <div style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }}></div>}
        
        <div style={getIconStyles()}>{getIcon()}</div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={nameStyles}>{node.name}</div>
          <div style={labelStyles}>{getLabelText()}</div>
        </div>

        {type === 'product' && node.code && (
          <div style={codeStyles}>{node.code}</div>
        )}
        {type === 'product' && node.brand && (
          <div style={codeStyles}>{node.brand.name}</div>
        )}
      </div>

      {expanded && (
        <div style={{ transition: 'all 0.2s' }}>
          {loadingChildren ? (
            <div style={loadingStyles(depth)}>Загрузка...</div>
          ) : loadError ? (
            <div style={errorStyles(depth)}>Ошибка: {loadError}</div>
          ) : (
            renderChildren()
          )}
        </div>
      )}
    </>
  );

  function renderChildren() {
    // Рекурсивно отображаем вложенные категории
    if (type === 'category' && node.children && node.children.length > 0) {
      return node.children.map((childCategory: any) => (
        <TreeNode
          key={`category-${childCategory.id}`}
          node={childCategory}
          type="category"
          depth={depth + 1}
          onNodeSelect={onNodeSelect}
          selectedNode={selectedNode}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      ));
    }

    // Отображаем spines категории
    if (type === 'category' && node.spines) {
      return node.spines.map((spine: SpineNode) => (
        <TreeNode
          key={`spine-${spine.id}`}
          node={spine}
          type="spine"
          depth={depth + 1}
          onNodeSelect={onNodeSelect}
          selectedNode={selectedNode}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      ));
    }

    // Загружаем и отображаем spines если их нет
    if (type === 'category' && !node.spines && !node.children) {
      return <div style={emptyStyles(depth)}>Загрузка spines...</div>;
    }

    // Отображаем продукты spine
    if (type === 'spine') {
      return children.map((product: ProductNode) => (
        <TreeNode
          key={`product-${product.id}`}
          node={product}
          type="product"
          depth={depth + 1}
          onNodeSelect={onNodeSelect}
          selectedNode={selectedNode}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      ));
    }

    // Сообщения если нет детей
    if ((type === 'category' && (!node.children || node.children.length === 0) && (!node.spines || node.spines.length === 0)) ||
        (type === 'spine' && children.length === 0)) {
      return <div style={emptyStyles(depth)}>{type === 'category' ? 'Нет подкатегорий и spines' : 'Нет товаров'}</div>;
    }

    return null;
  }
}

// Стили (остаются те же)
const toggleButtonStyles: React.CSSProperties = {
  width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
  marginRight: '0.5rem', color: '#6b7280', backgroundColor: 'transparent', border: 'none',
  borderRadius: '0.25rem', cursor: 'pointer'
};

const nameStyles: React.CSSProperties = {
  fontWeight: 500, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
};

const labelStyles: React.CSSProperties = {
  fontSize: '0.875rem', color: '#6b7280'
};

const codeStyles: React.CSSProperties = {
  fontSize: '0.875rem', color: '#9ca3af', marginLeft: '0.5rem', flexShrink: 0
};

const loadingStyles = (depth: number): React.CSSProperties => ({
  display: 'flex', justifyContent: 'center', padding: '0.5rem 0', fontSize: '0.875rem',
  color: '#6b7280', marginLeft: `${(depth + 1) * 24}px`
});

const emptyStyles = (depth: number): React.CSSProperties => ({
  fontSize: '0.875rem', fontStyle: 'italic', color: '#9ca3af', padding: '0.5rem 0.75rem',
  marginLeft: `${(depth + 1) * 24}px`
});

const errorStyles = (depth: number): React.CSSProperties => ({
  fontSize: '0.875rem', color: '#ef4444', padding: '0.5rem 0.75rem', marginLeft: `${(depth + 1) * 24}px`,
  backgroundColor: '#fef2f2', borderRadius: '0.25rem'
});