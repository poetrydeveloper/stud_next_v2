// app/product-units/[id]/logs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface LogEntry {
  id: number;
  action: string;
  details: string;
  userId: number;
  user?: {
    name: string;
    email: string;
  };
  createdAt: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

export default function ProductUnitLogsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Параллельно загружаем unit и логи
      const [unitResponse, logsResponse] = await Promise.all([
        fetch(`/api/product-units/${id}`),
        fetch(`/api/product-units/${id}/logs`)
      ]);

      if (!unitResponse.ok) {
        throw new Error("Failed to fetch unit");
      }

      const unitData = await unitResponse.json();
      setUnit(unitData);

      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setLogs(logsData.data || []);
      } else {
        setLogs([]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: "bg-green-100 text-green-800",
      UPDATE: "bg-blue-100 text-blue-800",
      DELETE: "bg-red-100 text-red-800",
      SOLD: "bg-purple-100 text-purple-800",
      RETURN: "bg-orange-100 text-orange-800",
      CREDIT: "bg-yellow-100 text-yellow-800",
      STATUS_CHANGE: "bg-indigo-100 text-indigo-800",
      default: "bg-gray-100 text-gray-800"
    };
    
    return colors[action] || colors.default;
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE: "Создание",
      UPDATE: "Обновление",
      DELETE: "Удаление",
      SOLD: "Продажа",
      RETURN: "Возврат",
      CREDIT: "Кредит",
      STATUS_CHANGE: "Смена статуса",
      default: action
    };
    
    return labels[action] || labels.default;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unit not found</h1>
          <p className="text-gray-600 mb-6">The product unit you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/product-units")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Units
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              История изменений
            </h1>
            <p className="text-gray-600">
              Unit: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{unit.serialNumber}</span>
              {unit.productName && (
                <span className="ml-4">Product: {unit.productName}</span>
              )}
            </p>
          </div>
          
          <button
            onClick={() => router.push(`/product-units/${id}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Назад к unit
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Logs List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет записей в истории</h3>
            <p className="text-gray-500">Здесь будут отображаться все изменения этого unit.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                  
                  {log.user && (
                    <span className="text-sm text-gray-500">
                      {log.user.name} ({log.user.email})
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="mb-3">
                  <p className="text-gray-800">{log.details}</p>
                </div>

                {/* Changes */}
                {(log.oldValues || log.newValues) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {log.oldValues && Object.keys(log.oldValues).length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Старые значения:</h4>
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          {Object.entries(log.oldValues).map(([key, value]) => (
                            <div key={key} className="flex justify-between mb-1">
                              <span className="text-red-700 font-medium">{key}:</span>
                              <span className="text-red-600">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {log.newValues && Object.keys(log.newValues).length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Новые значения:</h4>
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          {Object.entries(log.newValues).map(([key, value]) => (
                            <div key={key} className="flex justify-between mb-1">
                              <span className="text-green-700 font-medium">{key}:</span>
                              <span className="text-green-600">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      {logs.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Обновить историю
          </button>
        </div>
      )}
    </div>
  );
}