// app/product-units/UnitsGrid.tsx
"use client";

import { useState } from "react";
import ProductUnitCard from "@/app/components/ProductUnitCard";

interface Unit {
  id: number;
  serialNumber: string;
  productName: string;
  statusCard: string;
  quantityInCandidate?: number;
  createdAtCandidate?: string;
  requestPricePerUnit?: number;
}

interface UnitsGridProps {
  units: Unit[];
}

export default function UnitsGrid({ units: initialUnits }: UnitsGridProps) {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [quantityMap, setQuantityMap] = useState<Record<number, number>>({});
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

  const handleQuantityChange = (id: number, value: number) => {
    setQuantityMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCandidate = async (unitId: number) => {
    const quantity = quantityMap[unitId] || 1;
    setLoadingMap((prev) => ({ ...prev, [unitId]: true }));

    try {
      const res = await fetch("/api/product-units/add-to-candidate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, quantity }),
      });

      const data = await res.json();
      if (data.ok) {
        alert(`Единица добавлена в кандидаты (${quantity} шт.)`);
        // Обновляем статус на CANDIDATE в UI
        setUnits((prev) =>
          prev.map((u) =>
            u.id === unitId ? { ...u, statusCard: "CANDIDATE", quantityInCandidate: quantity, createdAtCandidate: new Date().toISOString() } : u
          )
        );
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка при добавлении в кандидаты");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [unitId]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {units.map((unit) => (
        <div key={unit.id} className="flex flex-col gap-4">
          <ProductUnitCard unit={unit} />

          {unit.statusCard?.toUpperCase() === "CLEAR" && (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={1}
                value={quantityMap[unit.id] || 1}
                onChange={(e) => handleQuantityChange(unit.id, Number(e.target.value))}
                className="border rounded px-2 py-1 w-20"
              />
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => handleAddToCandidate(unit.id)}
                disabled={loadingMap[unit.id]}
              >
                Добавить в кандидаты
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
