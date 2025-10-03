// app/product-units/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, Category, Spine, ProductUnitFormData } from "@/types/product-unit";

interface ApiProduct {
  id: number;
  name: string;
  code: string;
}

interface ApiCategory {
  id: number;
  name: string;
}

interface ApiSpine {
  id: number;
  name: string;
}

interface CategoriesSpinesResponse {
  ok: boolean;
  data: {
    category?: ApiCategory;
    spines?: ApiSpine[];
  };
}

/**
 * Создание новой единицы товара с выбором продукта, категории и спайна
 */
export default function NewProductUnitPage() {
  const router = useRouter();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [spines, setSpines] = useState<ApiSpine[]>([]);

  const [form, setForm] = useState<ProductUnitFormData>({
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

  // Загружаем продукты и поставки при монтировании
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, deliveriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/deliveries?status=ACTIVE")
        ]);

        const productsJson = await productsRes.json();
        setProducts(productsJson.data || []);

        if (deliveriesRes.ok) {
          const deliveriesJson = await deliveriesRes.json();
          setDeliveries(deliveriesJson.data || []);
        }
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        setProducts([]);
        setDeliveries([]);
      }
    }
    fetchData();
  }, []);

  // Загружаем категорию продукта и спайны
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
        const data: CategoriesSpinesResponse = await res.json();

        if (data.ok) {
          if (data.data.category) {
            setCategories([data.data.category]);
            setForm((f) => ({ ...f, categoryId: data.data.category!.id.toString() }));
          } else {
            setCategories([]);
            setForm((f) => ({ ...f, categoryId: "" }));
          }

          setSpines(data.data.spines || []);
          setForm((f) => ({ ...f, spineId: "" })); // Сбрасываем выбор спайна при смене продукта
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        body: JSON.stringify({
          ...form,
          purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : null,
          salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка создания единицы товара");
      }

      const data = await res.json();
      router.push(`/product-units/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания");
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
        {/* Остальная часть формы остается без изменений */}
        {/* ... */}
      </form>
    </div>
  );
}