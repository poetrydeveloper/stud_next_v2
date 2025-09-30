// app/components/LogsPanel_v2.tsx
"use client";

import { useEffect, useState } from "react";

interface Log {
  id: number;
  type: string | null;
  message: string;
  meta: any | null;
  createdAt: string;
}

export default function LogsPanel_v2({ unitId }: { unitId: number }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/product-units/${unitId}/logs`);
        const data = await res.json();
        if (res.ok) setLogs(data.data);
        else console.error(data.error);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [unitId]);

  return (
    <div className="border-t pt-2 text-xs text-gray-600 max-h-36 overflow-y-auto">
      <p className="font-semibold mb-1">Логи</p>

      {loading ? (
        <p className="text-gray-400">Загрузка...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-400">Нет записей</p>
      ) : (
        <div className="space-y-1">
          {logs.map((log) => {
            const date = new Date(log.createdAt);
            const formattedTime = date.toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
            });

            return (
              <div
                key={log.id}
                className="flex justify-between items-start gap-2"
              >
                <span className="text-gray-500 shrink-0">[{formattedTime}]</span>
                <span>{log.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
