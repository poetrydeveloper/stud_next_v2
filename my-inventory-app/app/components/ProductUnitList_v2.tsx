import ProductUnitItem from "./ProductUnitItem_v2";

export default function ProductUnitList({ title, units }) {
  if (units.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="flex flex-col gap-2">
        {units.map(unit => (
          <ProductUnitItem key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
}
