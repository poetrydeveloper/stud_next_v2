// app/components/ProductUnitStatusPanel_v2.tsx
"use client";

import { useState } from "react";

interface ProductUnitStatusPanelProps {
  unit: any;
  onStatusChange?: (status: string) => void;
}

export default function ProductUnitStatusPanel_v2({
  unit,
  onStatusChange,
}: ProductUnitStatusPanelProps) {
  const [status, setStatus] = useState(unit.statusCard);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/product-units/${unit.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка при обновлении");

      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (err) {
      console.error(err);
      alert("Не удалось обновить статус");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <button
        onClick={() =>
          updateStatus(status === "CLEAR" ? "CANDIDATE" : "CLEAR")
        }
        disabled={loading}
        className={`px-3 py-1 rounded ${
          status === "CANDIDATE"
            ? "bg-yellow-600 text-white"
            : "bg-gray-200 text-gray-700"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {status === "CANDIDATE" ? "Кандидат" : "Чистая"}
      </button>

      <button
        onClick={() => updateStatus("IN_REQUEST")}
        disabled={status !== "CANDIDATE" || loading}
        className={`px-3 py-1 rounded ${
          status === "IN_REQUEST"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
        } ${status !== "CANDIDATE" || loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        В заявку
      </button>

      <button
        onClick={() => updateStatus("SPROUTED")}
        disabled={status !== "CANDIDATE" || loading}
        className={`px-3 py-1 rounded ${
          status === "SPROUTED"
            ? "bg-purple-600 text-white"
            : "bg-gray-200 text-gray-700"
        } ${status !== "CANDIDATE" || loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Размножить
      </button>

      <button
        onClick={() => updateStatus("IN_DELIVERY")}
        disabled={
          (status !== "IN_REQUEST" && status !== "SPROUTED") || loading
        }
        className={`px-3 py-1 rounded ${
          status === "IN_DELIVERY"
            ? "bg-orange-600 text-white"
            : "bg-gray-200 text-gray-700"
        } ${
          (status !== "IN_REQUEST" && status !== "SPROUTED") || loading
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        В доставке
      </button>
    </div>
  );
}
