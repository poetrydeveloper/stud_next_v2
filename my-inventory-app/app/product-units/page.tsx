// app/product-units/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductUnit } from "@/app/lib/types/productUnit";
import ProductUnitCard from "@/app/components/ProductUnitCard";

export default function ProductUnitsPage() {
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const loadProductUnits = async () => {
    try {
      setLoading(true);
      const url = filter === "all" 
        ? "/api/product-units" 
        : `/api/product-units?status=${filter}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Ошибка загрузки единиц товара");
      }
      
      const data = await response.json();
      setProductUnits(data);
    } catch (err) {
      console.error("Ошибка:", err);
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductUnits();
  }, [filter]);

  const handleStatusChange = async (unitId: number, newStatus: ProductUnit['status']) => {
    try {
      const response = await fetch(`/api/product-units/${unitId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Ошибка обновления статуса");
      }

      setProductUnits(prev => prev.map(unit =>
        unit.id === unitId
          ? { ...unit, status: newStatus, soldAt: newStatus === 'SOLD' ? new Date().toISOString() : null }
          : unit
      ));
      
    } catch (err) {
      console.error("Ошибка:", err);
      alert("Не удалось обновить статус");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Загрузка единиц товара...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 mb-4 text-center">{error}</div>
        <button
          onClick={loadProductUnits}
          className="bg-blue-500 text-white px-4 py-2 rounded mx-auto block"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Карточки товара</h1>
      
      {/* Фильтры */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded text-sm ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Все
        </button>
        <button
          onClick={() => setFilter("IN_STORE")}
          className={`px-4 py-2 rounded text-sm ${
            filter === "IN_STORE" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          В магазине
        </button>
        <button
          onClick={() => setFilter("SOLD")}
          className={`px-4 py-2 rounded text-sm ${
            filter === "SOLD" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Проданные
        </button>
        <button
          onClick={() => setFilter("LOST")}
          className={`px-4 py-2 rounded text-sm ${
            filter === "LOST" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Утерянные
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded border text-center">
          <div className="text-2xl font-bold text-blue-600">
            {productUnits.filter(u => u.status === "IN_STORE").length}
          </div>
          <div className="text-sm text-blue-800">В магазине</div>
        </div>
        <div className="bg-green-50 p-4 rounded border text-center">
          <div className="text-2xl font-bold text-green-600">
            {productUnits.filter(u => u.status === "SOLD").length}
          </div>
          <div className="text-sm text-green-800">Проданные</div>
        </div>
        <div className="bg-red-50 p-4 rounded border text-center">
          <div className="text-2xl font-bold text-red-600">
            {productUnits.filter(u => u.status === "LOST").length}
          </div>
          <div className="text-sm text-red-800">Утерянные</div>
        </div>
      </div>

      {/* Список единиц товара - ИСПРАВЛЕНО: убрана grid */}
      {productUnits.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          Нет единиц товара для отображения
        </div>
      ) : (
        <div className="space-y-4"> {/* Вместо grid используем space-y-4 */}
          {productUnits.map((unit) => (
            <ProductUnitCard
              key={unit.id}
              unit={unit}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
