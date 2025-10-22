// app/super-add/components/ProductModal/components/BrandSection.tsx
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
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Бренд
      </label>
      <select
        value={brandId}
        onChange={(e) => onBrandChange(e.target.value ? Number(e.target.value) : '')}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Выберите бренд</option>
        {brands.map(brand => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
      
      <div className="mt-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newBrand}
            onChange={(e) => onNewBrandChange(e.target.value)}
            placeholder="Создать новый бренд"
            className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.newBrand 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          <button
            type="button"
            onClick={onCreateBrand}
            disabled={creatingBrand || !newBrand.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingBrand ? '...' : '+'}
          </button>
        </div>
        {errors.newBrand && (
          <p className="text-red-500 text-sm mt-1">{errors.newBrand}</p>
        )}
      </div>
    </div>
  );
}