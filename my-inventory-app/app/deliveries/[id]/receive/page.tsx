// app/deliveries/[id]/receive/page.tsx
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ReceiveDeliveryPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [delivery, setDelivery] = useState<any>(null);

  const deliveryId = params.id;

  const loadDelivery = async () => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}`);
      if (response.ok) {
        const data = await response.json();
        setDelivery(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки поставки:', error);
    }
  };

  const receiveDelivery = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/deliveries/${deliveryId}/receive`, {
        method: 'POST'
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Принято ${result.productUnits.length} единиц товара!`);
        router.push('/product-units');
      } else {
        alert(result.error || 'Ошибка при приемке поставки');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при приемке поставки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDelivery();
  }, [deliveryId]);

  if (!delivery) {
    return <div className="p-4">Загрузка...</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Приемка поставки</h1>
      
      <div className="bg-gray-50 p-4 rounded mb-4">
        <p><strong>Товар:</strong> {delivery.product?.name}</p>
        <p><strong>Количество:</strong> {delivery.quantity} шт.</p>
        <p><strong>Поставщик:</strong> {delivery.supplierName}</p>
        <p><strong>Статус:</strong> {delivery.status}</p>
      </div>

      <button
        onClick={receiveDelivery}
        disabled={loading || delivery.status === 'FULL'}
        className="w-full bg-green-500 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Обработка...' : 'Принять поставку'}
      </button>

      {delivery.status === 'FULL' && (
        <p className="text-red-500 mt-2 text-center">
          Эта поставка уже была принята
        </p>
      )}
    </div>
  );
}