// components/MillerColumns/modals/components/SupplierSection.tsx
import styles from '../../MillerColumns.module.css';

interface SupplierSectionProps {
  supplierId: number | '';
  newSupplier: string;
  suppliers: Array<{ id: number; name: string }>;
  creatingSupplier: boolean;
  errors: { newSupplier?: string };
  onSupplierChange: (supplierId: number | '') => void;
  onNewSupplierChange: (value: string) => void;
  onCreateSupplier: () => void;
}

export function SupplierSection({
  supplierId,
  newSupplier,
  suppliers,
  creatingSupplier,
  errors,
  onSupplierChange,
  onNewSupplierChange,
  onCreateSupplier
}: SupplierSectionProps) {
  return (
    <div className={styles.formGroup}>
      <label>Поставщик</label>
      <select
        value={supplierId}
        onChange={(e) => onSupplierChange(e.target.value ? Number(e.target.value) : '')}
      >
        <option value="">Выберите поставщика</option>
        {suppliers.map(supplier => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.name}
          </option>
        ))}
      </select>
      
      <div className={styles.createNewSection}>
        <div className={styles.createNewInput}>
          <input
            type="text"
            value={newSupplier}
            onChange={(e) => onNewSupplierChange(e.target.value)}
            placeholder="Создать нового поставщика"
            className={errors.newSupplier ? styles.inputError : ''}
          />
          <button
            type="button"
            onClick={onCreateSupplier}
            disabled={creatingSupplier || !newSupplier.trim()}
            className={styles.createNewBtn}
          >
            {creatingSupplier ? '...' : '+'}
          </button>
        </div>
        {errors.newSupplier && (
          <p className={styles.errorText}>{errors.newSupplier}</p>
        )}
      </div>
    </div>
  );
}