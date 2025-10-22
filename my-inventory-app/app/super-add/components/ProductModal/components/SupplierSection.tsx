// app/super-add/components/ProductModal/components/SupplierSection.tsx
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
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Поставщик
      </label>
      <select
        value={supplierId}
        onChange={(e) => onSupplierChange(e.target.value ? Number(e.target.value) : '')}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Выберите поставщика</option>
        {suppliers.map(supplier => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.name}
          </option>
        ))}
      </select>
      
      <div className="mt-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSupplier}
            onChange={(e) => onNewSupplierChange(e.target.value)}
            placeholder="Создать нового поставщика"
            className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.newSupplier 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          <button
            type="button"
            onClick={onCreateSupplier}
            disabled={creatingSupplier || !newSupplier.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingSupplier ? '...' : '+'}
          </button>
        </div>
        {errors.newSupplier && (
          <p className="text-red-500 text-sm mt-1">{errors.newSupplier}</p>
        )}
      </div>
    </div>
  );
}