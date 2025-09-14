//app/compoments/ProductCard.tsx
// возможно этот код не применяется в приложении
'use client';

import Link from 'next/link';
import React from 'react';

interface ProductImage {
  id: number;
  filename: string;
  path: string;
  isMain: boolean;
  productId: number;
}

interface Product {
  id: number;
  code: string;
  name: string;
  description: string | null;
  categoryId: number | null;
  images: ProductImage[];
  category: {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
  } | null;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  price: string;
  onQuantityChange: (productId: number, value: number) => void;
  onPriceChange: (productId: number, value: string) => void;
  onAddToRequest: (productId: number) => void;
  adding: boolean;
}

export default function ProductCard({
  product,
  quantity,
  price,
  onQuantityChange,
  onPriceChange,
  onAddToRequest,
  adding,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Изображение */}
      <div className="h-40 overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
        {product.images.length > 0 ? (
          <img
            src={product.images[0].path}
            alt={product.name}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.objectFit = 'cover';
              target.classList.add('p-0');
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">Нет изображения</span>
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>

        <p className="text-xs text-gray-600 mb-2">
          Код: <span className="font-mono">{product.code}</span>
        </p>

        {/* Описание */}
        <div className="mb-3 flex-1">
          {product.description ? (
            <p className="text-xs text-gray-700 line-clamp-3">{product.description}</p>
          ) : (
            <p className="text-xs text-gray-400 italic">Нет описания</p>
          )}
        </div>

        {/* Категория */}
        <div className="mb-3 min-h-[24px]">
          {product.category ? (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {product.category.name}
            </span>
          ) : (
            <span className="text-xs text-gray-400 italic">Без категории</span>
          )}
        </div>

        {/* Цена */}
        <div className="mb-3">
          <label className="block text-xs text-gray-600 mb-1">Цена за шт. (руб.):</label>
          <input
            type="text"
            value={price || '0'}
            onChange={(e) => onPriceChange(product.id, e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-0 focus:outline-none"
            placeholder="0.00"
          />
        </div>

        {/* Количество и кнопка добавления */}
        <div className="mt-auto pt-3 flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded-md w-20 bg-white">
            <button
              onClick={() => onQuantityChange(product.id, quantity - 1)}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-xs w-6 flex items-center justify-center"
              disabled={quantity <= 1}
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => onQuantityChange(product.id, parseInt(e.target.value) || 1)}
              className="w-8 text-center border-0 focus:ring-0 focus:outline-none text-xs py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => onQuantityChange(product.id, quantity + 1)}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-xs w-6 flex items-center justify-center"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onAddToRequest(product.id)}
            disabled={adding}
            className="flex-1 bg-blue-600 text-white py-2 px-2 rounded-md text-xs hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {adding ? '...' : 'В заявку'}
          </button>
        </div>

        {/* Редактировать */}
        <div className="mt-2">
          <Link
            href={`/products/${product.id}/edit`}
            className="block text-center bg-gray-200 text-gray-800 py-1 px-2 rounded-md text-xs hover:bg-gray-300 transition-colors"
          >
            Редактировать
          </Link>
        </div>

        {/* Доп. фото */}
        {product.images.length > 1 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Доп. фото: {product.images.length - 1}</p>
          </div>
        )}
      </div>
    </div>
  );
}
