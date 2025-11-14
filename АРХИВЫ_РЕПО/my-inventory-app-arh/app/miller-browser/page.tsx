// app/miller-browser/page.tsx
import { MillerColumns } from '@/app/components/MillerColumns/MillerColumns';

async function getRootNodes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/miller-columns`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch root categories');
  }
  
  const nodes = await res.json();
  return [nodes]; // ✅ Обернули в массив для initialColumns
}

export default async function MillerBrowserPage() {
  const initialColumns = await getRootNodes();
  
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Браузер каталога (Miller Columns)</h1>
      <MillerColumns initialColumns={initialColumns} />
    </main>
  );
}