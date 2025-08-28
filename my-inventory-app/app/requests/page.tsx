// app/requests/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Item {
  id: number;
  status: "IN_REQUEST" | "EXTRA" | "CANDIDATE";
  quantity: number;
  pricePerUnit: string;
  product: { 
    id: number; 
    code: string; 
    name: string;
    imageUrl?: string; // Добавим поле для изображения
  };
  requestId: number | null;
}

interface Request {
  id: number;
  status: "IN_REQUEST" | "EXTRA" | "CANDIDATE";
  notes: string | null;
  items: Item[];
  createdAt: string; // Добавим дату создания заявки
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requests")
      .then((r) => r.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Загрузка…</div>;

  // Сортируем заявки по дате (новые сверху)
  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Все заявки</h1>
      
      {sortedRequests.length === 0 ? (
        <div className="text-gray-600 text-center py-8">Нет заявок</div>
      ) : (
        sortedRequests.map((request) => (
          <div key={request.id} className="border rounded-lg p-4 bg-white shadow-sm">
            {/* Шапка заявки */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Заявка #{request.id}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                request.status === 'IN_REQUEST' 
                  ? 'bg-blue-100 text-blue-800' 
                  : request.status === 'EXTRA'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {request.status === 'IN_REQUEST' ? 'Обычная' : 
                 request.status === 'EXTRA' ? 'Экстра' : 'Кандидат'}
              </span>
            </div>

            {/* Обычные items */}
            {request.items.filter(item => item.status === "IN_REQUEST").length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Основные товары:</h3>
                <div className="space-y-2">
                  {request.items
                    .filter(item => item.status === "IN_REQUEST")
                    .map((item) => (
                      <RequestItem key={item.id} item={item} />
                    ))}
                </div>
              </div>
            )}

            {/* Extra items */}
            {request.items.filter(item => item.status === "EXTRA").length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium text-orange-700 mb-2">Экстра-товары:</h3>
                <div className="space-y-2">
                  {request.items
                    .filter(item => item.status === "EXTRA")
                    .map((item) => (
                      <RequestItem key={item.id} item={item} />
                    ))}
                </div>
              </div>
            )}

            {/* Заметка если есть */}
            {request.notes && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium text-gray-700 mb-1">Примечание:</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {request.notes}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// Компонент для отображения отдельного item
function RequestItem({ item }: { item: Item }) {
  return (
    <div className="flex items-center p-2 border rounded-md bg-gray-50 hover:bg-gray-100">
      {/* Миниатюра товара */}
      <div className="flex-shrink-0 mr-3">
        {item.product.imageUrl ? (
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            width={48}
            height={48}
            className="rounded object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500">Нет фото</span>
          </div>
        )}
      </div>
      
      {/* Информация о товаре */}
      <div className="flex-grow">
        <div className="font-medium">{item.product.name}</div>
        <div className="text-sm text-gray-600">
          Код: {item.product.code} | {item.quantity} шт. × {item.pricePerUnit} ₽
        </div>
      </div>
      
      {/* Итоговая стоимость */}
      <div className="flex-shrink-0 ml-2 text-right">
        <div className="font-semibold">
          {Math.round(item.quantity * parseFloat(item.pricePerUnit))} ₽
        </div>
      </div>
    </div>
  );
}