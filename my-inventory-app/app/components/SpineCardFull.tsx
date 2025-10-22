// app/components/SpineCardFull.tsx
"use client";

import { useState } from "react";
import { ProductUnitCardStatus } from "@prisma/client";

interface SpineCardProps {
  spine: {
    id: number;
    name: string;
    slug: string;
    imagePath?: string;
    productUnits: Array<{
      id: number;
      serialNumber: string;
      productCode?: string;
      productName?: string;
      productDescription?: string;
      statusCard: ProductUnitCardStatus;
      statusProduct?: string;
      quantityInCandidate?: number;
      quantityInRequest?: number;
      requestPricePerUnit?: number;
      product: { brand?: { name: string } };
    }>;
    _count: { productUnits: number };
  };
  onUnitStatusChange?: () => void;
}

export default function SpineCardFull({ spine, onUnitStatusChange }: SpineCardProps) {
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [loadingUnits, setLoadingUnits] = useState<number[]>([]);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  console.log("🔄 SpineCardFull рендерится:", {
    spineId: spine.id,
    unitsCount: spine.productUnits.length,
  });

  // Группировка units по брендам
  const brandsMap = new Map<string, typeof spine.productUnits>();
  spine.productUnits.forEach(unit => {
    const brand = unit.product.brand?.name || "Без бренда";
    if (!brandsMap.has(brand)) brandsMap.set(brand, []);
    brandsMap.get(brand)?.push(unit);
  });
  const brands = Array.from(brandsMap.entries());
  const activeBrand = brands[activeBrandIndex];
  const activeBrandUnits = activeBrand ? activeBrand[1] : [];

  // Фильтруем units по статусу
  const clearUnits = activeBrandUnits.filter(u => u.statusCard === ProductUnitCardStatus.CLEAR);
  const candidateUnits = activeBrandUnits.filter(u => u.statusCard === ProductUnitCardStatus.CANDIDATE);
  const inRequestUnits = activeBrandUnits.filter(u => u.statusCard === ProductUnitCardStatus.IN_REQUEST);

  const handleBrandClick = (index: number) => {
    console.log("🏷 Смена активного бренда:", brands[index][0]);
    setActiveBrandIndex(index);
  };

  const toggleExpanded = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleQuantityChange = (unitId: number, value: number) => {
    const quantity = Math.max(1, value);
    console.log("🔢 Изменение количества unit:", unitId, "=>", quantity);
    setQuantities(prev => ({ ...prev, [unitId]: quantity }));
  };

  const handleAddToCandidate = async (unitId: number) => {
    console.log("⭐ Добавление unit в CANDIDATE:", unitId);
    setLoadingUnits(prev => [...prev, unitId]);
    try {
      const res = await fetch("/api/product-units", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, quantity: 1 }),
      });
      if (res.ok) {
        console.log("✅ Unit добавлен в кандидаты:", unitId);
        onUnitStatusChange?.();
      } else {
        console.error("❌ Ошибка добавления в кандидаты:", await res.text());
      }
    } catch (err) {
      console.error("💥 Ошибка сети при добавлении в кандидаты:", err);
    } finally {
      setLoadingUnits(prev => prev.filter(id => id !== unitId));
    }
  };

  const handleCreateRequest = async (unitId: number, quantity: number) => {
    console.log("📦 Создание заявки для unit:", unitId, "количество:", quantity);
    setLoadingUnits(prev => [...prev, unitId]);
    try {
      const res = await fetch("/api/product-units/create-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, quantity }),
      });
      if (res.ok) {
        console.log("✅ Заявка создана для unit:", unitId);
        setExpandedUnits(prev => prev.filter(id => id !== unitId));
        onUnitStatusChange?.();
      } else {
        console.error("❌ Ошибка создания заявки:", await res.text());
      }
    } catch (err) {
      console.error("💥 Ошибка сети при создании заявки:", err);
    } finally {
      setLoadingUnits(prev => prev.filter(id => id !== unitId));
    }
  };

  const shorten = (text?: string, len = 60) => text && text.length > len ? text.slice(0, len) + "..." : text;

  return (
    <div className="bg-white rounded-lg shadow border w-80 flex flex-col cursor-pointer">
      {/* Бренды */}
      <div className="bg-gray-100 border-b px-2 py-1 flex gap-1 overflow-x-auto">
        {brands.map(([brand], i) => (
          <button
            key={brand}
            onClick={() => handleBrandClick(i)}
            className={`px-2 py-0.5 rounded text-xs font-medium ${i === activeBrandIndex ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {brand} ({brandsMap.get(brand)?.length})
          </button>
        ))}
      </div>

      {/* Название Spine */}
      <div className="p-2 border-b text-center text-sm font-medium">{spine.name}</div>

      {/* Units */}
      <div className="flex-1 p-2 overflow-y-auto space-y-2">
        {/* CLEAR */}
        {clearUnits.map(u => (
          <div key={u.id} className="border rounded p-1 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{u.productName}</span>
              <span className="text-xs text-gray-500">{u.productCode}</span>
              {u.productDescription && <span className="text-xs text-gray-400">{shorten(u.productDescription)}</span>}
            </div>
            <button
              disabled={loadingUnits.includes(u.id)}
              onClick={() => handleAddToCandidate(u.id)}
              className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
            >
              {loadingUnits.includes(u.id) ? "..." : "+ Кандидат"}
            </button>
          </div>
        ))}

        {/* CANDIDATE */}
        {candidateUnits.map(u => (
          <div key={u.id} className="border rounded p-1 flex flex-col">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-semibold">{u.productName}</span>
                <span className="text-xs text-gray-500 ml-1">{u.productCode}</span>
              </div>
              <button
                onClick={() => toggleExpanded(u.id)}
                className="text-xs text-blue-600"
              >
                {expandedUnits.includes(u.id) ? "Свернуть" : "Заявка →"}
              </button>
            </div>
            {expandedUnits.includes(u.id) && (
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="number"
                  min={1}
                  value={quantities[u.id] || u.quantityInCandidate || 1}
                  onChange={e => handleQuantityChange(u.id, parseInt(e.target.value))}
                  className="w-16 px-1 border rounded text-xs"
                />
                <button
                  disabled={loadingUnits.includes(u.id)}
                  onClick={() => handleCreateRequest(u.id, quantities[u.id] || 1)}
                  className="bg-green-500 text-white px-2 py-0.5 rounded text-xs"
                >
                  {loadingUnits.includes(u.id) ? "..." : "OK"}
                </button>
              </div>
            )}
          </div>
        ))}

        {/* IN_REQUEST (можно добавить аналогично) */}
      </div>

      {/* Статистика */}
      <div className="text-[10px] text-gray-600 border-t p-2 flex justify-between">
        <span>Брендов: {brands.length}</span>
        <span>Всего units: {spine._count.productUnits}</span>
      </div>
    </div>
  );
}
