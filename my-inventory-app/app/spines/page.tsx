// app/spines/page.tsx
"use client";

import { useEffect, useState } from "react";
import SpineCard_v2 from "@/app/components/SpineCard_v2";

export default function SpinesPage() {
  const [spines, setSpines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpines() {
      try {
        const res = await fetch("/api/spines");
        const data = await res.json();
        if (data.ok) {
          setSpines(data.spines);
        }
      } catch (err) {
        console.error("💥 Ошибка загрузки спинов:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSpines();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Загрузка спинов...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Торговые предложения</h1>
        <p className="text-gray-600 mt-2">
          Группы товарных единиц по характеристикам
        </p>
      </div>

      {spines.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">Нет торговых предложений</div>
          <p className="text-gray-500 mt-2">Создайте первое торговое предложение</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {spines.map((spine) => (
            <SpineCard_v2 key={spine.id} spine={spine} />
          ))}
        </div>
      )}
    </div>
  );
}