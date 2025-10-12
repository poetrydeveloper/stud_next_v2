"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  parentId: number | null;
}

interface Spine {
  id: number;
  name: string;
  slug: string;
}

interface Brand {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    categoryId: "",
    spineId: "",
    brandId: ""
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [spines, setSpines] = useState<Spine[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSpines, setLoadingSpines] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  // Загружаем данные при монтировании
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("🔄 Загрузка начальных данных...");
        setLoadingData(true);
        
        // Параллельная загрузка категорий и брендов
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/api/categories/tree"),
          fetch("/api/brands")
        ]);

        console.log("📡 Статусы ответов:", {
          categories: categoriesRes.status,
          brands: brandsRes.status
        });

        // Обрабатываем категории
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.data || []);
          console.log("✅ Категории загружены:", categoriesData.data?.length);
        } else {
          console.error("❌ Ошибка загрузки категорий:", categoriesRes.status);
        }

        // Обрабатываем бренды
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          console.log("📦 Данные брендов:", brandsData);
          setBrands(brandsData.data || []);
          console.log("✅ Бренды загружены:", brandsData.data?.length);
        } else {
          console.error("❌ Ошибка загрузки брендов:", brandsRes.status);
          setBrands([]);
        }

      } catch (error) {
        console.error("❌ Ошибка загрузки данных:", error);
        setError("Ошибка загрузки данных");
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  // Загружаем spines при изменении категории
  useEffect(() => {
    if (formData.categoryId) {
      setLoadingSpines(true);
      fetch(`/api/spines/category/${formData.categoryId}`)
        .then((res) => res.json())
        .then((data) => {
          setSpines(data.data || []);
          setFormData(prev => ({ ...prev, spineId: "" }));
        })
        .catch((error) => {
          console.error("Error loading spines:", error);
          setSpines([]);
        })
        .finally(() => setLoadingSpines(false));
    } else {
      setSpines([]);
      setFormData(prev => ({ ...prev, spineId: "" }));
    }
  }, [formData.categoryId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  // Рекурсивная функция для отображения дерева категорий
  const renderCategoryOptions = (nodes: any[], depth = 0): JSX.Element[] => {
    const options: JSX.Element[] = [];
    
    nodes.forEach((node) => {
      options.push(
        <option key={node.id} value={node.id}>
          {"\u00A0\u00A0".repeat(depth)}📁 {node.name}
        </option>
      );
      
      if (node.children && node.children.length > 0) {
        options.push(...renderCategoryOptions(node.children, depth + 1));
      }
    });
    
    return options;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Валидация
    if (!formData.name || !formData.code || !formData.categoryId) {
      setError("Заполните обязательные поля: Название, Код и Категория");
      setLoading(false);
      return;
    }

    try {
      // Создаем FormData вместо JSON
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("code", formData.code);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("categoryId", formData.categoryId);
      
      if (formData.spineId) {
        formDataToSend.append("spineId", formData.spineId);
      }
      
      if (formData.brandId) {
        formDataToSend.append("brandId", formData.brandId);
      }

      // Добавляем изображения
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      console.log("📤 Отправка FormData:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      const res = await fetch("/api/products", {
        method: "POST",
        // НЕ добавляем заголовок Content-Type - браузер сам установит multipart/form-data с boundary
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка при создании продукта");
      }

      alert("✅ Продукт создан успешно!");
      router.push("/products");
      
    } catch (err: any) {
      console.error("❌ Ошибка создания продукта:", err);
      setError(err.message);
      alert(`❌ Ошибка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="text-lg">Загрузка данных...</div>
          <div className="text-sm text-gray-500 mt-2">Категории и бренды</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Создать продукт</h1>
      
      {/* Отладочная информация */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <div className="text-sm text-blue-800">
          <div>📊 Статистика загрузки:</div>
          <div>• Категории: {categories.length}</div>
          <div>• Бренды: {brands.length} {brands.length > 0 && `(первый: "${brands[0]?.name}")`}</div>
          <div>• Spines: {spines.length} {loadingSpines && "(загрузка...)"}</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {/* Название */}
        <div>
          <label className="block font-medium">Название *</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
        </div>

        {/* Код */}
        <div>
          <label className="block font-medium">Код *</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.code}
            onChange={(e) => handleInputChange("code", e.target.value)}
            required
          />
        </div>

        {/* Описание */}
        <div>
          <label className="block font-medium">Описание</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        {/* Категория */}
        <div>
          <label className="block font-medium">Категория *</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={formData.categoryId}
            onChange={(e) => handleInputChange("categoryId", e.target.value)}
            required
          >
            <option value="">-- выберите категорию --</option>
            {renderCategoryOptions(categories)}
          </select>
        </div>

        {/* Spine */}
        <div>
          <label className="block font-medium">Spine (тип продукции)</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={formData.spineId}
            onChange={(e) => handleInputChange("spineId", e.target.value)}
            disabled={!formData.categoryId || loadingSpines}
          >
            <option value="">-- выберите spine --</option>
            {loadingSpines ? (
              <option>Загрузка spines...</option>
            ) : (
              spines.map((spine) => (
                <option key={spine.id} value={spine.id}>
                  {spine.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Бренд */}
        <div>
          <label className="block font-medium">Бренд</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={formData.brandId}
            onChange={(e) => handleInputChange("brandId", e.target.value)}
          >
            <option value="">-- выберите бренд --</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Изображения */}
        <div>
          <label className="block font-medium">Изображения</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            {images.length > 0 ? `Выбрано файлов: ${images.length}` : "Можно выбрать несколько изображений"}
          </p>
        </div>

        {/* Кнопки */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 flex-1"
            disabled={loading}
          >
            {loading ? "Создание..." : "Создать продукт"}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}