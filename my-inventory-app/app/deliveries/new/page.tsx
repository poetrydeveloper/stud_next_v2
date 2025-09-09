"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RequestItem {
  id: number;
  product: { name: string };
  quantity: number;
  deliveredQuantity: number;
  supplierName: string;
  customerName: string;
  pricePerUnit: string;
}

export default function NewDeliveryPage() {
  const router = useRouter();
  const [requestItems, setRequestItems] = useState<RequestItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchRequestItems() {
      try {
        const res = await fetch("/api/request-items?status=candidate");
        const data = await res.json();
        setRequestItems(data);
      } catch (e) {
        console.error("Ошибка при получении позиций заявок:", e);
      }
    }
    fetchRequestItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return setMessage("Выберите позицию заявки");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestItemId: selectedItemId,
          quantity,
          pricePerUnit: price || undefined
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
          <label className="font-medium">Позиция заявки</label>
          <select
            value={selectedItemId ?? ""}
            onChange={(e) => setSelectedItemId(Number(e.target.value))}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Выберите позицию</option>
            {requestItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.product.name} (Остаток: {item.quantity - item.deliveredQuantity})
              </option>
            ))}
          </select>
        </div>

        {/* Количество */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Количество</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Цена */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Цена за единицу (рекомендованная)</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Если пусто — используется цена из заявки"
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
