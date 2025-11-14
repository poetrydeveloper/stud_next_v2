// components/MillerColumns/modals/components/BrandSection.tsx
import styles from '../../MillerColumns.module.css';

interface BrandSectionProps {
  brandId: number | '';
  newBrand: string;
  brands: Array<{ id: number; name: string }>;
  creatingBrand: boolean;
  errors: { newBrand?: string };
  onBrandChange: (brandId: number | '') => void;
  onNewBrandChange: (value: string) => void;
  onCreateBrand: () => void;
}

export function BrandSection({
  brandId,
  newBrand,
  brands,
  creatingBrand,
  errors,
  onBrandChange,
  onNewBrandChange,
  onCreateBrand
}: BrandSectionProps) {
  return (
    <div className={styles.formGroup}>
      <label>Бренд</label>
      <select
        value={brandId}
        onChange={(e) => onBrandChange(e.target.value ? Number(e.target.value) : '')}
      >
        <option value="">Выберите бренд</option>
        {brands.map(brand => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
      
      <div className={styles.createNewSection}>
        <div className={styles.createNewInput}>
          <input
            type="text"
            value={newBrand}
            onChange={(e) => onNewBrandChange(e.target.value)}
            placeholder="Создать новый бренд"
            className={errors.newBrand ? styles.inputError : ''}
          />
          <button
            type="button"
            onClick={onCreateBrand}
            disabled={creatingBrand || !newBrand.trim()}
            className={styles.createNewBtn}
          >
            {creatingBrand ? '...' : '+'}
          </button>
        </div>
        {errors.newBrand && (
          <p className={styles.errorText}>{errors.newBrand}</p>
        )}
      </div>
    </div>
  );
}