// app/components/ProductStatus.tsx
import React from "react";

interface ProductStatusProps {
  inRequests: number;
  inStock: number;
  soldToday: number;
}

export default function ProductStatus({ inRequests, inStock, soldToday }: ProductStatusProps) {
  return (
    <div className="flex flex-col text-sm text-gray-600 space-y-1">
      <div>В заявках: <span className="font-semibold">{inRequests}</span></div>
      <div>На складе: <span className="font-semibold">{inStock}</span></div>
      <div>Продано сегодня: <span className="font-semibold">{soldToday}</span></div>
    </div>
  );
}
