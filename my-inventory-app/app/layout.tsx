// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <nav className="p-3 border-b flex gap-4">
          <Link href="/products">Товары</Link>
          <Link href="/products/new">Создать товар</Link>
          <Link href="/api/categories/new">Создать категорию</Link>
          <Link href="/api/categories/tree">Дерево категорий</Link>
          <Link href="/requests/candidates">Предзаявки</Link>
          <Link href="/requests">Заявки</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
