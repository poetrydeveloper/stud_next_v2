// app/product-units/components/unit/BrandTabs.tsx
interface BrandTabsProps {
  brands: [string, any[]][];
  activeBrand: string;
  onBrandChange: (brand: string) => void;
  totalUnits: number;
}

function BrandTabs({ brands, activeBrand, onBrandChange, totalUnits }: BrandTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto mb-3">
      <button
        onClick={(e) => { e.stopPropagation(); onBrandChange("all"); }}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
          activeBrand === "all" 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        <span>Все бренды</span>
        <span className={`px-1.5 py-0.5 rounded text-xs ${
          activeBrand === "all" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {totalUnits}
        </span>
      </button>

      {brands.map(([brandName, brandUnits]) => (
        <button
          key={brandName}
          onClick={(e) => { e.stopPropagation(); onBrandChange(brandName); }}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeBrand === brandName 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          <span>{brandName}</span>
          <span className={`px-1.5 py-0.5 rounded text-xs ${
            activeBrand === brandName ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {brandUnits.length}
          </span>
        </button>
      ))}
    </div>
  );
}