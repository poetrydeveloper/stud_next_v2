// app/product-units/components/unit/CreateRequestModal/ProductInfo.tsx
interface ProductInfoProps {
  unit: any;
}

export default function ProductInfo({ unit }: ProductInfoProps) {
  const productName = unit.productName || unit.product?.name || "Без названия";
  const productCode = unit.productCode || unit.product?.code || "—";
  const brandName = unit.product?.brand?.name;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{productName}</h4>
        <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
          {unit.serialNumber}
        </span>
      </div>
      
      <div className="space-y-1 text-sm text-gray-600">
        <div>Артикул: <span className="font-mono">{productCode}</span></div>
        {brandName && <div>Бренд: {brandName}</div>}
        <div>
          Текущий статус:{" "}
          <span className="font-medium capitalize">
            {unit.statusCard?.toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
}