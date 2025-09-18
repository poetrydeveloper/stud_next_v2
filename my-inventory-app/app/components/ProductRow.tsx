// app/components/ProductRow.tsx
"use client";

import React from "react";
import ProductStatus from "./ProductStatus";

type ProductImage = { id: number; path: string; filename?: string };
type Product = {
  id: number;
  code: string;
  name: string;
  images?: ProductImage[];
};

type Stats = {
  inRequests: number;
  inStore: number;
  soldToday: number;
  lastUpdated?: string;
};

type Props = {
  product: Product;
  stats?: Stats;
  quantity: number;
  price: string;
  onQuantityChange: (productId: number, value: number) => void;
  onPriceChange: (productId: number, value: string) => void;
  onAddToRequest: (productId: number) => void;
  adding?: boolean;
};

export default function ProductRow({
  product,
  stats,
  quantity,
  price,
  onQuantityChange,
  onPriceChange,
  onAddToRequest,
  adding = false,
}: Props) {
  return (
    <div className="flex items-center justify-between border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      {/* Левый блок: изображение + название */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 flex items-center justify-center border rounded-md bg-white">
          {product.images?.[0]?.path ? (
            <img src={product.images![0]!.path} alt={product.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-gray-400 text-xs">Нет фото</div>
          )}
        </div>

        <div>
          <div className="text-xs text-gray-500">{product.code}</div>
          <div className="font-semibold text-lg">{product.name}</div>
          <div className="mt-2">
            <ProductStatus
              inRequests={stats?.inRequests ?? 0}
              inStore={stats?.inStore ?? 0}
              soldToday={stats?.soldToday ?? 0}
              lastUpdated={stats?.lastUpdated ?? null}
            />
          </div>
        </div>
      </div>

      {/* Правый блок: кол-во, цена, кнопка */}
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500 mb-1">Кол-во</label>
          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => onQuantityChange(product.id, Math.max(1, Number(e.target.value) || 1))}
            className="w-16 px-2 py-1 border rounded text-center text-sm"
          />
        </div>

        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500 mb-1">Цена</label>
          <input
            type="text"
            value={price}
            onChange={(e) => onPriceChange(product.id, e.target.value.replace(/[^\d.]/g, ""))}
            className="w-24 px-2 py-1 border rounded text-center text-sm"
          />
        </div>

        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500 mb-1">Добавить</label>
          <button
            onClick={() => onAddToRequest(product.id)}
            disabled={adding}
            className={`w-10 h-10 rounded-md flex items-center justify-center font-bold transition ${
              adding ? "bg-gray-300 text-gray-600" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            title="Добавить в заявку"
          >
            {adding ? "..." : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}
