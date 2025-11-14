// app/product-units/CandidateUnitsView.tsx (ПОЛНЫЙ КОД)
"use client";

import React, { useState } from "react";

interface CandidateUnit {
  id: number;
  serialNumber: string;
  productName?: string;
  quantityInCandidate?: number;
  createdAtCandidate?: string;
  product?: {
    name: string;
    code: string;
    brand?: {
      name: string;
    };
    spine?: {
      name: string;
    };
  };
}

interface CandidateUnitsViewProps {
  units: CandidateUnit[];
}

export default function CandidateUnitsView({ units }: CandidateUnitsViewProps) {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [prices, setPrices] = useState<{ [key: number]: number }>({});
  const [loadingUnits, setLoadingUnits] = useState<number[]>([]);

  const handleQuantityChange = (unitId: number, value: number) => {
    setQuantities(prev => ({ ...prev, [unitId]: Math.max(1, value) }));
  };

  const handlePriceChange = (unitId: number, value: number) => {
    setPrices(prev => ({ ...prev, [unitId]: Math.max(0, value) }));
  };

  const handleAddToRequest = async (unitId: number) => {
    const quantity = quantities[unitId] || 1;
    const pricePerUnit = prices[unitId] || 0;

    if (pricePerUnit <= 0) {
      alert("Укажите цену за единицу товара");
      return;
    }

    setLoadingUnits(prev => [...prev, unitId]);

    try {
      const response = await fetch("/api/product-units/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId,
          quantity,
          pricePerUnit
        }),
      });

      const data = await response.json();
      
      if (data.ok) {
        alert(data.message || `Заявка создана на ${quantity} единиц`);
        window.location.reload();
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (error) {
      alert("Произошла ошибка при создании заявки");
    } finally {
      setLoadingUnits(prev => prev.filter(id => id !== unitId));
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (units.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 px-6 py-4 border-b border-yellow-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="mr-2">🎯</span>
          Кандидаты
          <span className="ml-3 bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm">
            {units.length} единиц
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Товар
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Кандидат с
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Кол-во
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Цена за шт.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Сумма
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {units.map(unit => {
              const quantity = quantities[unit.id] || unit.quantityInCandidate || 1;
              const pricePerUnit = prices[unit.id] || 0;
              const totalAmount = quantity * pricePerUnit;
              const isLoading = loadingUnits.includes(unit.id);

              return (
                <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 text-sm mb-1">
                        {unit.productName || unit.product?.name || "Без названия"}
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                          {unit.serialNumber}
                        </span>
                        <span>Арт: {unit.product?.code || "—"}</span>
                        {unit.product?.brand && (
                          <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            🏷️ {unit.product.brand.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(unit.createdAtCandidate)}
                  </td>

                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(unit.id, Number(e.target.value))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                      disabled={isLoading}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={pricePerUnit}
                        onChange={(e) => handlePriceChange(unit.id, Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="0.00"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-600">₽</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {pricePerUnit > 0 && (
                      <div className="text-sm font-semibold text-green-600">
                        {totalAmount.toFixed(2)} ₽
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleAddToRequest(unit.id)}
                      disabled={isLoading || pricePerUnit <= 0}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? "..." : "В заявку"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}