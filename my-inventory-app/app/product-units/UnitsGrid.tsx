// app/product-units/UnitsGrid.tsx
"use client";

import { useState } from "react";
import ProductUnitCard from "@/app/components/ProductUnitCard";

interface ProductUnitLog {
  id: number;
  type: string;
  message: string;
  meta: any;
  createdAt: string;
}

interface Unit {
  id: number;
  serialNumber: string;
  productName: string;
  statusCard: string;
  statusProduct?: string;
  quantityInCandidate?: number;
  createdAtCandidate?: string;
  requestPricePerUnit?: number;
  // 🔥 ВАЖНО: ДОБАВЛЯЕМ ЛОГИ В ТИП
  logs?: ProductUnitLog[];
  product?: {
    name: string;
    code: string;
    images?: Array<{ id: number; path: string; isMain: boolean }>;
    spine?: { name: string };
    category?: { name: string };
  };
}

interface UnitsGridProps {
  units: Unit[];
}

export default function UnitsGrid({ units: initialUnits }: UnitsGridProps) {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [quantityMap, setQuantityMap] = useState<Record<number, number>>({});
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

  // 🔥 ДОБАВЛЯЕМ ОТЛАДОЧНЫЙ ВЫВОД
  console.log("🔍 UnitsGrid получил units:", {
    unitsCount: units.length,
    firstUnit: units[0] ? {
      id: units[0].id,
      serialNumber: units[0].serialNumber,
      logsCount: units[0].logs?.length || 0,
      hasLogs: !!units[0].logs,
      logs: units[0].logs // 👈 проверяем здесь!
    } : 'no units'
  });

  const handleQuantityChange = (id: number, value: number) => {
    setQuantityMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCandidate = async (unitId: number) => {
    const quantity = quantityMap[unitId] || 1;
    setLoadingMap((prev) => ({ ...prev, [unitId]: true }));

    try {
      console.log("📤 Добавление в кандидаты:", { unitId, quantity });
      
      const res = await fetch("/api/product-units", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          unitId, 
          quantity
        }),
      });

      const data = await res.json();
      console.log("📥 Ответ от API кандидатов:", data);
      
      if (data.ok) {
        alert(`Единица добавлена в кандидаты (${quantity} шт.)`);
        
        // 🔥 ОБНОВЛЯЕМ ЮНИТ С НОВЫМИ ЛОГАМИ ИЗ ОТВЕТА
        setUnits((prev) =>
          prev.map((u) =>
            u.id === unitId ? { 
              ...u, 
              statusCard: "CANDIDATE", 
              quantityInCandidate: quantity, 
              createdAtCandidate: new Date().toISOString(),
              logs: data.data?.logs || u.logs // 👈 сохраняем новые логи
            } : u
          )
        );
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error("💥 Ошибка добавления в кандидаты:", err);
      alert("Произошла ошибка при добавлении в кандидаты");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [unitId]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {units.map((unit) => (
        <div key={unit.id} className="flex flex-col">
          <ProductUnitCard unit={unit} />
          
          {/* Кнопка добавления в кандидаты */}
          {unit.statusCard === "CLEAR" && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Кол-во:</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantityMap[unit.id] || 1}
                  onChange={(e) => handleQuantityChange(unit.id, Number(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <button
                className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => handleAddToCandidate(unit.id)}
                disabled={loadingMap[unit.id]}
              >
                {loadingMap[unit.id] ? "Добавление..." : "В кандидаты"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}