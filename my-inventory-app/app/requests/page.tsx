// app/requests/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Item {
  id: number;
  status: "IN_REQUEST" | "EXTRA";
  quantity: number;
  pricePerUnit: string;
  product: { id: number; code: string; name: string };
  requestId: number | null;
}

interface RequestRow {
  id: number;
  status: "IN_REQUEST" | "EXTRA" | "CANDIDATE";
  notes: string | null;
  items: Item[];
}

export default function RequestsPage() {
  const [inReq, setInReq] = useState<RequestRow[]>([]);
  const [extra, setExtra] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/requests?status=in_request").then((r) => r.json()),
      fetch("/api/requests?status=extra").then((r) => r.json()),
    ]).then(([a, b]) => {
      setInReq(a);
      setExtra(b);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4">Загрузка…</div>;

  return (
    <div className="p-4 space-y-8">
      <section>
        <h1 className="text-xl font-bold mb-4">Заявки (IN_REQUEST)</h1>
        {inReq.length === 0 ? (
          <div className="text-gray-600">Пока пусто</div>
        ) : (
          inReq.map((r) => (
            <div key={r.id} className="border rounded p-3 mb-3">
              <div className="font-semibold mb-2">Заявка #{r.id}</div>
              <ul className="list-disc ml-6">
                {r.items.map((it) => (
                  <li key={it.id}>
                    {it.product.name} ({it.product.code}) — {it.quantity} шт, {it.pricePerUnit} за ед.
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>

      <section>
        <h1 className="text-xl font-bold mb-4">EXTRA</h1>
        {extra.length === 0 ? (
          <div className="text-gray-600">Пока пусто</div>
        ) : (
          extra.map((r) => (
            <div key={r.id} className="border rounded p-3 mb-3">
              <div className="font-semibold mb-2">EXTRA #{r.id}</div>
              <ul className="list-disc ml-6">
                {r.items.map((it) => (
                  <li key={it.id}>
                    {it.product.name} ({it.product.code}) — {it.quantity} шт, {it.pricePerUnit} за ед.
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
