// app/components/ProductRow.tsx
"use client";

import React from "react";
import ProductStatus from "./ProductStatus";

interface ProductRowProps {
  product: any;
  quantity: number;
  price: string;
  onQuantityChange: (productId: number, value: number) => void;
  onPriceChange: (productId: number, value: string) => void;
  onAddToRequest: (productId: number) => void;
  adding: boolean;
}

export default function ProductRow({
  product,
  quantity,
  price,
  onQuantityChange,
  onPriceChange,
  onAddToRequest,
  adding,
}: ProductRowProps) {
  return (
    <div className="flex items-center justify-between border rounded-xl p-3 shadow-sm hover:shadow-md transition">
      {/* Изображение товара */}
      <div className="flex items-center space-x-4">
        {product.images?.[0]?.path ? (
          <img
            src={product.images[0].path}
            alt={product.name}
            className="w-16 h-16 object-contain rounded-md border"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md text-gray-400">
            Нет фото
          </div>
        )}
        <div>
          <div className="text-sm text-gray-500">{product.code}</div>
          <div className="font-semibold">{product.name}</div>
          <ProductStatus
            inRequests={product.inRequests || 0}
            inStock={product.inStock || 0}
            soldToday={product.soldToday || 0}
          />
        </div>
      </div>

      {/* Поля для ввода */}
      <div className="flex items-center space-x-2">
        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500">Кол-во</label>
          <input
            type="number"
            className="border rounded-md px-2 py-1 w-16 text-center"
            value={quantity}
            min={1}
            onChange={(e) => onQuantityChange(product.id, Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500">Цена</label>
          <input
            type="text"
            className="border rounded-md px-2 py-1 w-20 text-center"
            value={price}
            onChange={(e) => onPriceChange(product.id, e.target.value)}
          />
        </div>

        <button
          onClick={() => onAddToRequest(product.id)}
          disabled={adding}
          className={`px-3 py-2 rounded-md font-semibold transition ${
            adding
              ? "bg-gray-300 text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {adding ? "..." : "+"}
        </button>
      </div>
    </div>
  );
}
