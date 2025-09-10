// app/deliveries/new/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RequestItem {
  id: number;
  product: { name: string };
  quantity: number;
  deliveredQuantity: number;
  supplier: { name: string } | null;
  customer: { name: string } | null;
  pricePerUnit: string;
}

export default function NewDeliveryPage() {
  const router = useRouter();
  const [requestItems, setRequestItems] = useState<RequestItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedItem = requestItems.find(item => item.id === selectedItemId);

  useEffect(() => {
    async function fetchRequestItems() {
      try {
        const res = await fetch("/api/request-items?status=IN_REQUEST");
        const data = await res.json();
        setRequestItems(data);
      } catch (e) {
        console.error("Ошибка при получении позиций заявок:", e);
        setMessage("❌ Не удалось загрузить позиции заявок");
      }
    }
    fetchRequestItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return setMessage("Выберите позицию заявки");

    if (quantity < 1) return setMessage("❌ Количество должно быть больше 0");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestItemId: selectedItemId,
          quantity,
          pricePerUnit: price || selectedItem?.pricePerUnit || "0"
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage("✅ Поставка успешно создана");
        setTimeout(() => router.push("/deliveries"), 1000);
      } else {
        setMessage(`❌ ${data.error || "Ошибка создания поставки"}`);
      }
    } catch (e) {
      setMessage("❌ Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/deliveries" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Назад к списку поставок
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Создать поставку</h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-sm font-medium ${
            message.includes("✅") ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 border rounded shadow-md">
        {/* Выбор позиции заявки */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Позиция заявки *</label>
          <select
            value={selectedItemId ?? ""}
            onChange={(e) => setSelectedItemId(e.target.value ? Number(e.target.value) : null)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
            disabled={loading}
          >
            <option value="">Выберите позицию</option>
            {requestItems.map((item) => {
              const remaining = item.quantity - item.deliveredQuantity;
              return (
                <option key={item.id} value={item.id}>
                  {item.product.name} (Остаток: {remaining}, Поставщик: {item.supplier?.name || "Не указан"})
                </option>
              );
            })}
          </select>
        </div>

        {/* Информация о выбранной позиции */}
        {selectedItem && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Информация о позиции:</h3>
            <p>Товар: {selectedItem.product.name}</p>
            <p>Поставщик: {selectedItem.supplier?.name || "Не указан"}</p>
            <p>Покупатель: {selectedItem.customer?.name || "Не указан"}</p>
            <p>Рекомендованная цена: {selectedItem.pricePerUnit} ₽</p>
            <p>Доступно для поставки: {selectedItem.quantity - selectedItem.deliveredQuantity} шт.</p>
          </div>
        )}

        {/* Количество */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Количество *</label>
          <input
            type="number"
            min={1}
            max={selectedItem ? selectedItem.quantity - selectedItem.deliveredQuantity : undefined}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
            disabled={loading}
          />
        </div>

        {/* Цена */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Цена за единицу</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))}
            placeholder={selectedItem?.pricePerUnit ? `По умолчанию: ${selectedItem.pricePerUnit} ₽` : "Введите цену"}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 p-3 rounded-lg text-white font-medium transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Сохранение..." : "Создать поставку"}
        </button>
      </form>
    </div>
  );
}
