// app/api/product-stats/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

/**
 * Возвращает статистику по продуктам:
 * - inRequests: суммарное количество в RequestItem (статусы CANDIDATE и IN_REQUEST)
 * - inStore: количество ProductUnit со статусом IN_STORE
 * - soldToday: количество ProductUnit со статусом SOLD и soldAt >= начало дня
 *
 * Поддерживает:
 *  GET /api/product-stats           -> возвращает map { [productId]: { inRequests, inStore, soldToday, lastUpdated } }
 *  GET /api/product-stats?productId=123  -> возвращает объект для продукта 123
 *  GET /api/product-stats?force=1       -> принудительно пересчитывает (не использует кэш)
 *
 * Кэш: в памяти, TTL = 3 минуты.
 */

// Кэш в памяти
type StatRow = {
  inRequests: number;
  inStore: number;
  soldToday: number;
  lastUpdated: number; // ms since epoch
};

const statsCache: Record<number, StatRow> = {};
let globalCacheUpdatedAt = 0;

const CACHE_TTL = 3 * 60 * 1000; // 3 минуты

function isExpired(ts: number) {
  if (!ts) return true;
  return Date.now() - ts > CACHE_TTL;
}

async function computeStatsForProduct(productId: number): Promise<StatRow> {
  // 1) inRequests: суммарно quantity из RequestItem для данного продукта и статусов CANDIDATE, IN_REQUEST
  const reqAgg = await prisma.requestItem.aggregate({
    _sum: { quantity: true },
    where: {
      productId,
      status: { in: ["CANDIDATE", "IN_REQUEST"] },
    },
  });
  const inRequests = Number(reqAgg._sum.quantity ?? 0);

  // 2) inStore: count ProductUnit со статусом IN_STORE
  const inStore = await prisma.productUnit.count({
    where: {
      productId,
      status: "IN_STORE",
    },
  });

  // 3) soldToday: count ProductUnit со статусом SOLD и soldAt >= начало текущего дня
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const soldToday = await prisma.productUnit.count({
    where: {
      productId,
      status: "SOLD",
      soldAt: { gte: startOfDay },
    },
  });

  const row: StatRow = {
    inRequests,
    inStore,
    soldToday,
    lastUpdated: Date.now(),
  };

  // Обновляем кэш
  statsCache[productId] = row;
  globalCacheUpdatedAt = Date.now();
  return row;
}

async function computeStatsForAllProducts(): Promise<Record<number, StatRow>> {
  // Получим все product ids — для производительности можно ограничить выборку, но пока берем все.
  const products = await prisma.product.findMany({ select: { id: true } });
  const res: Record<number, StatRow> = {};
  for (const p of products) {
    // Если есть валидный кэш — используем, иначе пересчитаем
    if (!statsCache[p.id] || isExpired(statsCache[p.id].lastUpdated)) {
      res[p.id] = await computeStatsForProduct(p.id);
    } else {
      res[p.id] = statsCache[p.id];
    }
  }
  globalCacheUpdatedAt = Date.now();
  return res;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const productIdParam = url.searchParams.get("productId");
    const force = url.searchParams.get("force") === "1";

    if (productIdParam) {
      const productId = Number(productIdParam);
      if (Number.isNaN(productId)) {
        return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
      }

      if (force || !statsCache[productId] || isExpired(statsCache[productId].lastUpdated)) {
        const row = await computeStatsForProduct(productId);
        return NextResponse.json({
          productId,
          stats: {
            inRequests: row.inRequests,
            inStore: row.inStore,
            soldToday: row.soldToday,
            lastUpdated: new Date(row.lastUpdated).toISOString(),
          },
        });
      }

      const cached = statsCache[productId];
      return NextResponse.json({
        productId,
        stats: {
          inRequests: cached.inRequests,
          inStore: cached.inStore,
          soldToday: cached.soldToday,
          lastUpdated: new Date(cached.lastUpdated).toISOString(),
        },
      });
    }

    // Все продукты: если глобальный кэш устарел — обновляем всё, иначе возвращаем имеющийся кэш
    if (force || isExpired(globalCacheUpdatedAt)) {
      const all = await computeStatsForAllProducts();
      const result: Record<number, any> = {};
      for (const pidStr of Object.keys(all)) {
        const pid = Number(pidStr);
        const r = all[pid];
        result[pid] = {
          inRequests: r.inRequests,
          inStore: r.inStore,
          soldToday: r.soldToday,
          lastUpdated: new Date(r.lastUpdated).toISOString(),
        };
      }
      return NextResponse.json(result);
    } else {
      // Возвращаем текущее содержимое кэша (возможно неполное)
      const result: Record<number, any> = {};
      for (const pidStr of Object.keys(statsCache)) {
        const pid = Number(pidStr);
        const r = statsCache[pid];
        result[pid] = {
          inRequests: r.inRequests,
          inStore: r.inStore,
          soldToday: r.soldToday,
          lastUpdated: new Date(r.lastUpdated).toISOString(),
        };
      }
      return NextResponse.json(result);
    }
  } catch (e) {
    console.error("Error in GET /api/product-stats:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
