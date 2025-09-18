// app/api/product-stats/route.ts
import { NextResponse } from 'next/server';

/**
 * Простая in-memory "база" статусов — годится для локальной разработки.
 * В реальном проекте статусы берутся из БД.
 */
let statsMap: Record<number, { inRequests: number; inStore: number; soldToday: number }> = {
  1: { inRequests: 2, inStore: 120, soldToday: 1 },
  2: { inRequests: 5, inStore: 29, soldToday: 6 },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pid = url.searchParams.get('productId');
  if (pid) {
    const id = Number(pid);
    return NextResponse.json({ productId: id, stats: statsMap[id] ?? { inRequests: 0, inStore: 0, soldToday: 0 } });
  }
  // Возвращаем всю карту: ключи - id продуктов
  return NextResponse.json(statsMap);
}

/**
 * Экспортируем карту для возможного импорта в другие роуты.
 */
export { statsMap };
