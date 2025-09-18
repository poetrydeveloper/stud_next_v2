// app/components/ProductCard.tsx
'use client';

import React from 'react';

type ProductImage = {
  id: number;
  filename: string;
  path: string;
  isMain: boolean;
  productId: number;
};

type Product = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  categoryId?: number | null;
  images?: ProductImage[];
};

type Stats = {
  inRequests: number;
  inStore: number;
  soldToday: number;
};

type Props = {
  product: Product;
  quantity: number;
  price: string;
  onQuantityChange: (productId: number, value: number) => void;
  onPriceChange: (productId: number, value: string) => void;
  onAddToRequest: (productId: number) => Promise<void> | void;
  adding?: boolean;
  stats?: Stats;
};

export default function ProductCard({
  product,
  quantity,
  price,
  onQuantityChange,
  onPriceChange,
  onAddToRequest,
  adding = false,
  stats = { inRequests: 0, inStore: 0, soldToday: 0 },
}: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-3 flex items-center justify-between hover:shadow-md transition">
      {/* Изображение */}
      <div className="w-14 h-14 flex-shrink-0">
        <img
          src={product.images?.[0]?.path || '/no-image.png'}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Информация */}
      <div className="flex-1 ml-4">
        <div className="text-xs text-gray-500">{product.code}</div>
        <div className="font-medium">{product.name}</div>

        {/* Статусы: в заявках / в магазине / продано сегодня */}
        <div className="flex gap-4 mt-2 text-xs text-gray-600">
          <div className="flex items-baseline gap-2">
            <span className="text-gray-500">В заявках</span>
            <span className="font-semibold">{stats.inRequests}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-gray-500">В магазине</span>
            <span className="font-semibold">{stats.inStore}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-gray-500">Продано сегодня</span>
            <span className="font-semibold">{stats.soldToday}</span>
          </div>
        </div>
      </div>

      {/* Кол-во, Цена и Добавить */}
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
            onChange={(e) => {
              const numeric = e.target.value.replace(/[^\d.]/g, '');
              onPriceChange(product.id, numeric);
            }}
            placeholder="0.00"
            className="w-20 px-2 py-1 border rounded text-sm text-center"
          />
        </div>

        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500 mb-1">Добавить</label>
          <button
            onClick={() => onAddToRequest(product.id)}
            disabled={adding}
            className="w-9 h-9 flex items-center justify-center rounded-md border hover:bg-gray-100 disabled:opacity-60"
            title="Добавить в заявку"
          >
            {adding ? <span className="text-xs">⏳</span> : <span className="text-lg font-bold">+</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
