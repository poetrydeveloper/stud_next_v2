// app/miller-full/page.tsx
import { FullDataMillerColumns } from '@/app/components/MillerColumns/FullDataMillerColumns';

async function getPageData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/miller-columns/page-data`, {
    cache: 'no-store',
  });
  
  console.log('🌳 Page data fetch status:', res.status);
  
  if (!res.ok) {
    console.error('❌ Failed to fetch page data:', res.statusText);
    throw new Error('Failed to fetch page data');
  }
  
  const data = await res.json();
  console.log('🌳 Received page data:', {
    dataLength: data.data?.length,
    stats: data.stats
  });
  
  return data;
}

export default async function MillerFullPage() {
  const { data: initialData, stats } = await getPageData();
  
  return (
    <main className="p-6">
      <FullDataMillerColumns initialData={initialData} stats={stats} />
    </main>
  );
}