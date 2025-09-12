// app/layout.tsx
"use client";

import "./globals.css";
import Link from "next/link";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSuppliersOpen, setIsSuppliersOpen] = useState(false);
  const [isCustomersOpen, setIsCustomersOpen] = useState(false);
  const [isDeliveriesOpen, setIsDeliveriesOpen] = useState(false);
  const [isUnitsOpen, setIsUnitsOpen] = useState(false);

  // Функция для закрытия всех меню, кроме текущего
  const closeAllMenus = () => {
    setIsSuppliersOpen(false);
    setIsCustomersOpen(false);
    setIsDeliveriesOpen(false);
    setIsUnitsOpen(false);
  };

  return (
    <html lang="ru">
      <body>
        <nav className="p-3 border-b flex gap-6 items-center bg-white shadow-sm relative flex-wrap">
          {/* --- Товары --- */}
          <Link href="/products" className="hover:underline">
            Товары
          </Link>
          <Link href="/products/new" className="hover:underline">
            Создать товар
          </Link>

          {/* --- Категории --- */}
          <Link href="/api/categories/new" className="hover:underline">
            Создать категорию
          </Link>
          <Link href="/api/categories/tree" className="hover:underline">
            Дерево категорий
          </Link>

          {/* --- Заявки --- */}
          <Link href="/requests/candidates" className="hover:underline">
            Предзаявки
          </Link>
          <Link href="/requests" className="hover:underline">
            Заявки
          </Link>

          {/* --- Поставки --- */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDeliveriesOpen((prev) => !prev);
                setIsSuppliersOpen(false);
                setIsCustomersOpen(false);
                setIsUnitsOpen(false);
              }}
              className="px-3 py-1 rounded hover:bg-gray-100 transition flex items-center gap-1"
            >
              Поставки
              <span className={`transition-transform ${isDeliveriesOpen ? "rotate-180" : "rotate-0"}`}>
                ▼
              </span>
            </button>

            {isDeliveriesOpen && (
              <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <Link
                  href="/deliveries"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  Все поставки
                </Link>
                <Link
                  href="/deliveries/new"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  Создать поставку
                </Link>
              </div>
            )}
          </div>

          {/* --- Product Units --- */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUnitsOpen((prev) => !prev);
                setIsSuppliersOpen(false);
                setIsCustomersOpen(false);
                setIsDeliveriesOpen(false);
              }}
              className="px-3 py-1 rounded hover:bg-gray-100 transition flex items-center gap-1"
            >
              Единицы товара
              <span className={`transition-transform ${isUnitsOpen ? "rotate-180" : "rotate-0"}`}>
                ▼
              </span>
            </button>

            {isUnitsOpen && (
              <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <Link
                  href="/product-units"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  Все единицы
                </Link>
                <Link
                  href="/product-units/in-store"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  В магазине
                </Link>
                <Link
                  href="/product-units/sold"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  Проданные
                </Link>
                <Link
                  href="/product-units/lost"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  Утерянные
                </Link>
                <Link
                  href="/deliveries/new-unit"
                  className="block px-4 py-2 hover:bg-gray-100 border-t mt-1 pt-1"
                  onClick={closeAllMenus}
                >
                  + Создать единицу
                </Link>
              </div>
            )}
          </div>

          {/* --- Поставщики --- */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSuppliersOpen((prev) => !prev);
                setIsCustomersOpen(false);
                setIsDeliveriesOpen(false);
                setIsUnitsOpen(false);
              }}
              className="px-3 py-1 rounded hover:bg-gray-100 transition flex items-center gap-1"
            >
              Поставщики
              <span className={`transition-transform ${isSuppliersOpen ? "rotate-180" : "rotate-0"}`}>
                ▼
              </span>
            </button>

            {isSuppliersOpen && (
              <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <Link
                  href="/suppliers"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  Все поставщики
                </Link>
                <Link
                  href="/suppliers/new"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  Создать поставщика
                </Link>
              </div>
            )}
          </div>

          {/* --- Покупатели --- */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCustomersOpen((prev) => !prev);
                setIsSuppliersOpen(false);
                setIsDeliveriesOpen(false);
                setIsUnitsOpen(false);
              }}
              className="px-3 py-1 rounded hover:bg-gray-100 transition flex items-center gap-1"
            >
              Покупатели
              <span className={`transition-transform ${isCustomersOpen ? "rotate-180" : "rotate-0"}`}>
                ▼
              </span>
            </button>

            {isCustomersOpen && (
              <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <Link
                  href="/customers"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  Все покупатели
                </Link>
                <Link
                  href="/customers/new"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  Создать покупателя
                </Link>
              </div>
            )}
          </div>
        </nav>

        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}