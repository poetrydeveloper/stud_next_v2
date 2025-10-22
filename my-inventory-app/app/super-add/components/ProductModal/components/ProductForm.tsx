// app/super-add/components/ProductModal/components/ProductForm.tsx
import { BrandSection } from './BrandSection';
import { SupplierSection } from './SupplierSection';

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
  onCodeChange, onNameChange, onDescriptionChange, onBrandChange, onSupplierChange,
  onNewBrandChange, onNewSupplierChange, onCreateBrand, onCreateSupplier,
  onSubmit, onClose
}: ProductFormProps) {
  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">Создать Продукт</h3>
      <form onSubmit={onSubmit}>
        {/* Артикул */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Артикул/Код *
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="Например: FR75510"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.code 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-purple-500'
            }`}
            autoFocus
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code}</p>
          )}
        </div>

        {/* Название */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название продукта *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Например: Ключ рожковый 10мм"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.name 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-purple-500'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Описание */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Описание товара (необязательно)"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать продукт'}
          </button>
        </div>
      </form>
    </div>
  );
}