// app/product-units/components/unit/CreateRequestModal/RequestSummary.tsx
interface RequestSummaryProps {
  quantity: number;
  pricePerUnit: number;
}

export default function RequestSummary({ quantity, pricePerUnit }: RequestSummaryProps) {
  const total = quantity * pricePerUnit;

  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-700">Итоговая сумма:</span>
        <span className="font-semibold text-blue-700 text-lg">
          {total.toFixed(2)} ₽
        </span>
      </div>
      <div className="text-xs text-gray-600 mt-1">
        {quantity} × {pricePerUnit.toFixed(2)} ₽
      </div>
    </div>
  );
}