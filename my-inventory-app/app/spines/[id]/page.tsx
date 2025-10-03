// app/spines/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface SpineDetails {
  id: number;
  name: string;
  slug: string;
  category: { id: number; name: string } | null;
  imagePath: string | null;
  products: any[];
  productUnits: any[];
}

export default function SpineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const spineId = params.id as string;

  const [spine, setSpine] = useState<SpineDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUnits: 0,
    unitsByStatus: {} as Record<string, number>
  });

  useEffect(() => {
    if (spineId) {
      fetch(`/api/spines/${spineId}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setSpine(data);
            calculateStats(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Ошибка загрузки Spine:", err);
          setLoading(false);
        });
    }
  }, [spineId]);

  const calculateStats = (spineData: any) => {
    const statusCount: Record<string, number> = {};
    
    spineData.productUnits?.forEach((unit: any) => {
      const status = unit.statusCard || 'UNKNOWN';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    setStats({
      totalProducts: spineData.products?.length || 0,
      totalUnits: spineData.productUnits?.length || 0,
      unitsByStatus: statusCount
    });
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены что хотите удалить этот Spine?")) return;

    try {
      const res = await fetch(`/api/spines/${spineId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/spines");
      } else {
        alert("Ошибка при удалении Spine");
      }
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка при удалении Spine");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-500">Загрузка Spine...</p>
      </div>
    );
  }

  if (!spine) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">Spine не найден</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{spine.name}</h1>
          <p className="text-gray-600">Slug: {spine.slug}</p>
          {spine.category && (
            <p className="text-gray-600">Категория: {spine.category.name}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link
            href={`/spines/${spineId}/edit`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Редактировать
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
      </div>

      {spine.imagePath && (
        <div className="mb-6">
          <img 
            src={spine.imagePath} 
            alt={spine.name}
            className="max-w-xs rounded shadow"
          />
        </div>
      )}

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="font-semibold text-gray-700">Продукты</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalProducts}</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="font-semibold text-gray-700">Единицы товара</h3>
          <p className="text-2xl font-bold text-green-600">{stats.totalUnits}</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="font-semibold text-gray-700">Статусы</h3>
          <div className="text-sm text-gray-600">
            {Object.entries(stats.unitsByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between">
                <span>{status}:</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Продукты */}
      <div className="bg-white rounded shadow border p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Продукты в этом Spine</h2>
        {spine.products && spine.products.length > 0 ? (
          <div className="space-y-2">
            {spine.products.map(product => (
              <div key={product.id} className="border-b pb-2 last:border-none">
                <div className="flex justify-between">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-500">{product.code}</span>
                </div>
                {product.description && (
                  <p className="text-sm text-gray-600">{product.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Нет продуктов в этом Spine</p>
        )}
      </div>

      <Link
        href="/spines"
        className="text-blue-500 hover:underline"
      >
        ← Назад к списку Spine
      </Link>
    </div>
  );
}