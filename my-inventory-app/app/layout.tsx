// app/layout.tsx
"use client";

import "./globals.css";
import Link from "next/link";
import { useState } from "react";
import { Menu, ChevronDown } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      title: "Товары",
      links: [
        { href: "/products", label: "Все товары" },
        { href: "/products/new", label: "Создать товар" },
        { href: "/brands/new", label: "Создать бренд" },
        { href: "/categories/new", label: "Создать категорию/спайн" },
        { href: "/api/categories/tree", label: "Дерево категорий" },
        { href: "/spines/tree", label: "Дерево Spine" }, // ← новый пункт
      ],
    },
    {
      title: "Поставки",
      links: [
        { href: "/deliveries", label: "Все поставки" },
        { href: "/deliveries/new", label: "Создать поставку" },
      ],
    },
    {
      title: "Единицы товара",
      links: [
        { href: "/product-units", label: "Все единицы" },
        { href: "/product-units/in-store", label: "В магазине" },
        { href: "/product-units/sold", label: "Проданные" },
        { href: "/product-units/lost", label: "Утерянные" },
        { href: "/deliveries/new-unit", label: "+ Создать единицу" },
      ],
    },
    {
      title: "Контрагенты",
      links: [
        { href: "/suppliers", label: "Все поставщики" },
        { href: "/suppliers/new", label: "Создать поставщика" },
        { href: "/customers", label: "Все покупатели" },
        { href: "/customers/new", label: "Создать покупателя" },
      ],
    },
    {
      title: "Касса",
      links: [{ href: "/cash-days", label: "Кассовые дни" }],
    },
    {
      title: "Заявки",
      links: [
        { href: "/requests/candidates", label: "Предзаявки" },
        { href: "/requests", label: "Заявки" },
      ],
    },
  ];

  return (
    <html lang="ru">
      <body className="bg-gray-50">
        {/* Верхняя панель */}
        <header className="flex items-center justify-between p-4 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold">Магазин</h1>
          </div>
          <div>
            <Link href="/" className="text-sm text-gray-600 hover:underline">
              Главная
            </Link>
          </div>
        </header>

        {/* Боковое меню */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform z-50 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-64"
          }`}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Навигация</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              ✕
            </button>
          </div>

          <nav className="p-4">
            {menuItems.map((menu) => (
              <div key={menu.title} className="mb-4">
                <button
                  onClick={() => toggleMenu(menu.title)}
                  className="w-full flex justify-between items-center py-2 px-3 rounded hover:bg-gray-100 transition"
                >
                  <span>{menu.title}</span>
                  <ChevronDown
                    className={`transition-transform ${openMenu === menu.title ? "rotate-180" : ""}`}
                    size={18}
                  />
                </button>
                {openMenu === menu.title && (
                  <div className="mt-2 ml-3 border-l pl-3 space-y-2">
                    {menu.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-sm text-gray-700 hover:underline"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Основной контент */}
        <main className="p-4 transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
