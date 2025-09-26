"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Создание новой единицы товара с выбором продукта, категории и спайна
 */
export default function NewProductUnitPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [spines, setSpines] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    categoryId: "",
    spineId: "",
    deliveryId: "",
    serialNumber: "",
    purchasePrice: "",
    salePrice: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Загружаем продукты и поставки при монтировании ---
  useEffect(() => {
  async function fetchData() {
    try {
      const productsRes = await fetch("/api/products");
      const productsJson = await productsRes.json();
      setProducts(productsJson.data || []); // <- только массив
    } catch (err) {
      console.error("Ошибка загрузки продуктов:", err);
      setProducts([]);
    }
  }
  fetchData();
}, []);

  // --- Загружаем категорию продукта и спайны ---
  useEffect(() => {
    async function fetchCategoryAndSpines() {
      if (!form.productId) {
        setCategories([]);
        setSpines([]);
        setForm((f) => ({ ...f, categoryId: "", spineId: "" }));
        return;
      }

      try {
        const res = await fetch(`/api/products/${form.productId}/categories-spines`);
        const data = await res.json();

        if (data.ok) {
          if (data.data.category) {
            setCategories([data.data.category]);
            setForm((f) => ({ ...f, categoryId: data.data.category.id, spineId: "" }));
          } else {
            setCategories([]);
            setForm((f) => ({ ...f, categoryId: "", spineId: "" }));
          }

          setSpines(data.data.spines || []);
        } else {
          setCategories([]);
          setSpines([]);
          setForm((f) => ({ ...f, categoryId: "", spineId: "" }));
        }
      } catch (err) {
        console.error("Ошибка загрузки категории и спайнов:", err);
        setCategories([]);
        setSpines([]);
        setForm((f) => ({ ...f, categoryId: "", spineId: "" }));
      }
    }
    fetchCategoryAndSpines();
  }, [form.productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.productId || !form.categoryId || !form.spineId) {
      setError("Выберите продукт, категорию и спайн");
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
        headers: { "Content-Type": "application/json" },
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
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200"
      >
        {/* Продукт */}
        <div>
          <label className="block text-gray-700 mb-1">Продукт</label>
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">— Выберите продукт —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Категория */}
        <div>
          <label className="block text-gray-700 mb-1">Категория</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            disabled={!categories.length}
          >
            <option value="">— Выберите категорию —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Спайн */}
        <div>
          <label className="block text-gray-700 mb-1">Спайн</label>
          <select
            name="spineId"
            value={form.spineId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            disabled={!spines.length}
          >
            <option value="">— Выберите спайн —</option>
            {spines.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
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

        {/* Поставка */}
        <div>
          <label className="block text-gray-700 mb-1">Привязать к поставке (опционально)</label>
          <select
            name="deliveryId"
            value={form.deliveryId}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">— Без поставки —</option>
            {deliveries.map((d) => (
              <option key={d.id} value={d.id}>
                #{d.id} — {d.requestItem?.supplier?.name || "Поставщик не указан"}
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
          />
        </div>

        {/* Кнопка */}
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
