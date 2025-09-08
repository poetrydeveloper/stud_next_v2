// app/layout.tsx
"use client";

import "./globals.css";
import Link from "next/link";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <html lang="ru">
      <body>
        <nav className="p-3 border-b flex gap-4 items-center bg-white shadow-sm">
          {/* Товары */}
          <Link href="/products" className="hover:underline">
            Товары
          </Link>
          <Link href="/products/new" className="hover:underline">
            Создать товар
          </Link>

          {/* Категории */}
          <Link href="/api/categories/new" className="hover:underline">
            Создать категорию
          </Link>
          <Link href="/api/categories/tree" className="hover:underline">
            Дерево категорий
          </Link>

          {/* Заявки */}
          <Link href="/requests/candidates" className="hover:underline">
            Предзаявки
          </Link>
          <Link href="/requests" className="hover:underline">
            Заявки
          </Link>

          {/* --- Поставщики с выпадающим меню --- */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="px-3 py-1 rounded hover:bg-gray-100 transition flex items-center gap-1"
            >
              Поставщики
              <span className={`transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}>
                ▼
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <Link
                  href="/suppliers"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Все поставщики
                </Link>
                <Link
                  href="/suppliers/new"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Создать поставщика
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
