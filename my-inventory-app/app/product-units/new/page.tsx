// app/product-units/new/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Страница для создания новой единицы товара.
 * Позволяет выбрать продукт, ввести данные и сохранить.
 */
export default function NewProductUnitPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    deliveryId: "",
    serialNumber: "",
    purchasePrice: "",
    salePrice: "",
    productCategoryName: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Загружаем продукты и поставки при загрузке страницы
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, deliveriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/deliveries"),
        ]);
        const productsData = await productsRes.json();
        const deliveriesData = await deliveriesRes.json();
        setProducts(productsData);
        setDeliveries(deliveriesData);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.productId) {
      setError("Выберите продукт");
      setLoading(false);
      return;
    }

    if (!form.serialNumber.trim()) {
      setError("Укажите серийный номер");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/product-units", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка создания единицы товара");
      }

      const data = await res.json();
      router.push(`/product-units/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Новая единица товара</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200"
      >
        {/* Выбор продукта */}
        <div>
          <label className="block text-gray-700 mb-1">Продукт</label>
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">— Выберите продукт —</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Серийный номер */}
        <div>
          <label className="block text-gray-700 mb-1">Серийный номер</label>
          <input
            type="text"
            name="serialNumber"
            value={form.serialNumber}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Например: SN-123456"
          />
        </div>

        {/* Цена закупки */}
        <div>
          <label className="block text-gray-700 mb-1">Цена закупки</label>
          <input
            type="number"
            name="purchasePrice"
            value={form.purchasePrice}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Например: 1000"
          />
        </div>

        {/* Планируемая цена продажи */}
        <div>
          <label className="block text-gray-700 mb-1">Цена продажи (планируемая)</label>
          <input
            type="number"
            name="salePrice"
            value={form.salePrice}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Например: 1500"
          />
        </div>

        {/* Категория */}
        <div>
          <label className="block text-gray-700 mb-1">Категория</label>
          <input
            type="text"
            name="productCategoryName"
            value={form.productCategoryName}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Например: Смартфоны"
          />
        </div>

        {/* Поставка (опционально) */}
        <div>
          <label className="block text-gray-700 mb-1">Привязать к поставке (опционально)</label>
          <select
            name="deliveryId"
            value={form.deliveryId}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">— Без поставки —</option>
            {deliveries.map((delivery) => (
              <option key={delivery.id} value={delivery.id}>
                #{delivery.id} — {delivery.requestItem?.supplier?.name || "Поставщик не указан"}
              </option>
            ))}
          </select>
        </div>

        {/* Примечания */}
        <div>
          <label className="block text-gray-700 mb-1">Примечание</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Например: поступил с небольшой царапиной на корпусе"
          ></textarea>
        </div>

        {/* Кнопка отправки */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
