// app/components/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Магазин
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                isActive('/') ? 'bg-blue-800' : ''
              }`}
            >
              Главная
            </Link>

            <Link
              href="/products"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                isActive('/products') ? 'bg-blue-800' : ''
              }`}
            >
              Товары
            </Link>

            <Link
              href="/product-units"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                isActive('/product-units') ? 'bg-blue-800' : ''
              }`}
            >
              Единицы товара
            </Link>

            <Link
              href="/cash-days"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                isActive('/cash-days') ? 'bg-blue-800' : ''
              }`}
            >
              Касса
            </Link>

            <Link
              href="/deliveries"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                isActive('/deliveries') ? 'bg-blue-800' : ''
              }`}
            >
              Поставки
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 ${
                isActive('/') ? 'bg-blue-800' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>

            <Link
              href="/products"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 ${
                isActive('/products') ? 'bg-blue-800' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Товары
            </Link>

            <Link
              href="/product-units"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 ${
                isActive('/product-units') ? 'bg-blue-800' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Единицы товара
            </Link>

            <Link
              href="/cash-days"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 ${
                isActive('/cash-days') ? 'bg-blue-800' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Касса
            </Link>

            <Link
              href="/deliveries"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 ${
                isActive('/deliveries') ? 'bg-blue-800' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Поставки
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
