// components/MillerColumns/modals/components/ProductForm.tsx
import { BrandSection } from './BrandSection';
import { SupplierSection } from './SupplierSection';
import styles from '../../MillerColumns.module.css';

interface ProductFormProps {
  code: string;
  name: string;
  description: string;
  brandId: number | '';
  supplierId: number | '';
  newBrand: string;
  newSupplier: string;
  brands: Array<{ id: number; name: string }>;
  suppliers: Array<{ id: number; name: string }>;
  loading: boolean;
  creatingBrand: boolean;
  creatingSupplier: boolean;
  errors: { 
    code?: string; 
    name?: string;
    newBrand?: string;
    newSupplier?: string;
  };
  parentPath: string;
  onCodeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onBrandChange: (brandId: number | '') => void;
  onSupplierChange: (supplierId: number | '') => void;
  onNewBrandChange: (value: string) => void;
  onNewSupplierChange: (value: string) => void;
  onCreateBrand: () => void;
  onCreateSupplier: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ProductForm({
  code, name, description, brandId, supplierId, newBrand, newSupplier,
  brands, suppliers, loading, creatingBrand, creatingSupplier, errors,
  parentPath, onCodeChange, onNameChange, onDescriptionChange, onBrandChange, onSupplierChange,
  onNewBrandChange, onNewSupplierChange, onCreateBrand, onCreateSupplier,
  onSubmit, onClose
}: ProductFormProps) {
  return (
    <>
      <h3 className={styles.modalTitle}>Создать Продукт</h3>
      <form onSubmit={onSubmit}>
        {/* Артикул */}
        <div className={styles.formGroup}>
          <label>Артикул/Код *</label>
          <input
            type="text"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="Например: FR75510"
            className={errors.code ? styles.inputError : ''}
            autoFocus
          />
          {errors.code && (
            <p className={styles.errorText}>{errors.code}</p>
          )}
        </div>

        {/* Название */}
        <div className={styles.formGroup}>
          <label>Название продукта *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Например: Ключ рожковый 10мм"
            className={errors.name ? styles.inputError : ''}
          />
          {errors.name && (
            <p className={styles.errorText}>{errors.name}</p>
          )}
        </div>

        {/* Описание */}
        <div className={styles.formGroup}>
          <label>Описание</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Описание товара (необязательно)"
            rows={3}
          />
        </div>

        {/* Бренд */}
        <BrandSection
          brandId={brandId}
          newBrand={newBrand}
          brands={brands}
          creatingBrand={creatingBrand}
          errors={errors}
          onBrandChange={onBrandChange}
          onNewBrandChange={onNewBrandChange}
          onCreateBrand={onCreateBrand}
        />

        {/* Поставщик */}
        <SupplierSection
          supplierId={supplierId}
          newSupplier={newSupplier}
          suppliers={suppliers}
          creatingSupplier={creatingSupplier}
          errors={errors}
          onSupplierChange={onSupplierChange}
          onNewSupplierChange={onNewSupplierChange}
          onCreateSupplier={onCreateSupplier}
        />

        {parentPath && (
          <div className={styles.formInfo}>
            <small>Родительский путь: {parentPath}</small>
          </div>
        )}

        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={styles.cancelBtn}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? 'Создание...' : 'Создать продукт'}
          </button>
        </div>
      </form>
    </>
  );
}