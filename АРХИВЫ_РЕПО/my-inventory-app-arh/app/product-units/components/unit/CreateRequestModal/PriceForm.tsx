// app/product-units/components/unit/CreateRequestModal/PriceForm.tsx
interface PriceFormProps {
  unit: any;
  quantity: number;
  pricePerUnit: string;
  onQuantityChange: (quantity: number) => void;
  onPriceChange: (price: string) => void;
}

export default function PriceForm({ 
  unit, 
  quantity, 
  pricePerUnit, 
  onQuantityChange, 
  onPriceChange 
}: PriceFormProps) {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Количество единиц
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={quantity}
          onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value)))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {unit.statusCard === "CANDIDATE" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Цена за единицу (₽)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={pricePerUnit}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      )}
    </>
  );
}