// components/MillerColumns/Column/ColumnHeader.tsx
import styles from '../MillerColumns.module.css';

type ColumnHeaderProps = {
  columnIndex: number;
  parentNodeType?: 'category' | 'spine' | 'product';
  onCreateCategory: () => void;
  onCreateSpine: () => void;
  onCreateProduct: () => void;
};

export function ColumnHeader({ 
  columnIndex,
  parentNodeType,
  onCreateCategory,
  onCreateSpine,
  onCreateProduct
}: ColumnHeaderProps) {
  // Определяем какие кнопки показывать
  const canCreateCategory = !parentNodeType || parentNodeType === 'category';
  const canCreateSpine = parentNodeType === 'category';
  const canCreateProduct = parentNodeType === 'spine';

  return (
    <div className={styles.header}>
      {canCreateCategory && (
        <button 
          className={styles.addBtn}
          onClick={onCreateCategory}
          title="Добавить категорию"
        >
          + Категория
        </button>
      )}
      
      {canCreateSpine && (
        <button 
          className={styles.addBtn}
          onClick={onCreateSpine}
          title="Добавить spine"
        >
          + Spine
        </button>
      )}

      {canCreateProduct && (
        <button 
          className={styles.addBtn}
          onClick={onCreateProduct}
          title="Добавить продукт"
        >
          + Продукт
        </button>
      )}
    </div>
  );
}