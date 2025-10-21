"use client";

import "./globals.css";
import Link from "next/link";
import { useState } from "react";
import { Menu, ChevronDown, Database, Warehouse, PlusCircle } from "lucide-react";

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
        { href: "/spines/tree", label: "Дерево Spine" },
        // ДОБАВЛЕНА ССЫЛКА НА SUPER ADD
        { href: "/super-add", label: "⚡ SUPER ADD", icon: "⚡" },
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
    // НОВЫЙ РАЗДЕЛ - Разборка/Сборка
    {
      title: "Разборка/Сборка",
      links: [
        { href: "/disassembly", label: "Все операции" },
        { href: "/disassembly/scenario/create", label: "Создать сценарий" },
        { href: "/store", label: "Склад (состояния)", icon: "🏪" },
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
          <div className="flex items-center gap-4">
            {/* КНОПКА SUPER ADD */}
            <Link 
              href="/super-add" 
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition text-sm font-medium shadow-md"
            >
              <PlusCircle size={18} />
              ⚡ SUPER ADD
            </Link>
            
            {/* Кнопка склада */}
            <Link 
              href="/store" 
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              <Warehouse size={18} />
              Склад
            </Link>
            
            {/* Кнопка админки БД */}
            <Link 
              href="/admin/database-backup" 
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <Database size={18} />
              Бэкапы БД
            </Link>
            
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
                        className="flex items-center gap-2 text-sm text-gray-700 hover:underline"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {link.icon && <span>{link.icon}</span>}
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* ОТДЕЛЬНЫЕ КНОПКИ В САЙДБАРЕ */}
            <div className="mt-6 space-y-2">
              {/* Кнопка SUPER ADD в сайдбаре */}
              <Link 
                href="/super-add" 
                className="flex items-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition text-sm font-medium shadow-md"
                onClick={() => setIsSidebarOpen(false)}
              >
                <PlusCircle size={18} />
                ⚡ SUPER ADD
              </Link>
              
              {/* Кнопка склада в сайдбаре */}
              <Link 
                href="/store" 
                className="flex items-center gap-2 w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Warehouse size={18} />
                Склад
              </Link>
              
              {/* Кнопка админки БД в сайдбаре */}
              <Link 
                href="/admin/database-backup" 
                className="flex items-center gap-2 w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Database size={18} />
                Бэкапы БД
              </Link>
            </div>
          </nav>
        </aside>

        {/* Основной контент */}
        <main className="p-4 transition-all duration-300">
          {children}
        </main>

        {/* Оверлей для закрытия меню */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </body>
    </html>
  );
}