// app/components/ProductStatus.tsx
import React from "react";

type Props = {
  inRequests: number;
  inStore: number;
  soldToday: number;
  lastUpdated?: string | null; // ISO string
  ttlMs?: number; // TTL для определения устаревания (по умолчанию 3 мин)
};

export default function ProductStatus({
  inRequests,
  inStore,
  soldToday,
  lastUpdated,
  ttlMs = 3 * 60 * 1000,
}: Props) {
  const isStale = (() => {
    if (!lastUpdated) return true;
    const last = new Date(lastUpdated).getTime();
    return Date.now() - last > ttlMs;
  })();

  const colorClass = isStale ? "text-red-600" : "text-green-600";
  const dot = isStale ? "🔴" : "🟢";

  // краткое время назад
  const timeAgo = (() => {
    if (!lastUpdated) return "—";
    const diff = Date.now() - new Date(lastUpdated).getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m`;
    const hr = Math.floor(min / 60);
    return `${hr}h`;
  })();

  return (
    <div className={`text-sm ${colorClass}`}>
      <span className="mr-2">{dot}</span>
      <span>
        В заявках: <span className="font-semibold">{inRequests}</span> /&nbsp;
        На складе: <span className="font-semibold">{inStore}</span> /&nbsp;
        Продано: <span className="font-semibold">{soldToday}</span>
      </span>
      <span className="ml-3 text-xs text-gray-500">({timeAgo})</span>
    </div>
  );
}
