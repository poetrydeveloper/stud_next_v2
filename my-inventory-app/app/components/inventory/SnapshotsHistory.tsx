// app/components/inventory/SnapshotsHistory.tsx
"use client";
import { useState, useEffect } from 'react';

export default function SnapshotsHistory() {
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSnapshots = async () => {
    try {
      const response = await fetch('/api/inventory/snapshots');
      const result = await response.json();
      
      if (result.ok) {
        setSnapshots(result.data.snapshots);
      }
    } catch (error) {
      console.error('Error loading snapshots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnapshots();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Загрузка истории снимков...</div>;
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4">📊 История снимков</h3>
      
      {snapshots.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Снимков еще нет. Создайте первый снимок остатков.
        </div>
      ) : (
        <div className="space-y-3">
          {snapshots.slice(0, 10).map((snapshot) => (
            <div key={snapshot.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <div className="font-medium">
                  {snapshot.productUnit?.product?.name || 'Агрегированный снимок'}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(snapshot.snapshotDate).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{snapshot.stockValue} ₽</div>
                <div className="text-sm text-gray-500">{snapshot.statusProduct}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={loadSnapshots}
        className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded text-sm"
      >
        Обновить историю
      </button>
    </div>
  );
}