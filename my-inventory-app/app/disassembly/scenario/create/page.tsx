// app/disassembly/scenario/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DisassemblyScenarioForm from "@/app/components/DisassemblyScenarioForm";

interface ProductUnit {
  id: number;
  serialNumber: string;
  productName?: string;
  statusProduct: string;
  disassemblyStatus: string;
  product?: {
    id: number;
    name: string;
    code: string;
    description?: string;
    brand?: {
      name: string;
    };
    spine?: {
      id: number;
      name: string;
    };
    category?: {
      name: string;
    };
    images?: Array<{
      path: string;
      isMain: boolean;
    }>;
  };
}

export default function CreateScenarioPage() {
  const searchParams = useSearchParams();
  const unitId = searchParams.get("unitId");
  
  const [unit, setUnit] = useState<ProductUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!unitId) {
      setError("ID unit не указан");
      setLoading(false);
      return;
    }

    const loadUnit = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/disassembly/unit/${unitId}`);
        const data = await response.json();
        
        if (data.ok) {
          setUnit(data.data);
        } else {
          setError(data.error || "Unit не найден");
        }
      } catch (err: any) {
        setError("Ошибка загрузки unit: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUnit();
  }, [unitId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных unit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ошибка</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unit не найден</h1>
          <p className="text-gray-600 mb-6">Не удалось загрузить данные unit</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  // Проверяем можно ли создавать сценарий для этого unit
  if (unit.statusProduct !== "IN_STORE" || unit.disassemblyStatus !== "MONOLITH") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Нельзя создать сценарий</h1>
          <p className="text-gray-600 mb-4">
            Unit должен быть на складе (IN_STORE) и иметь статус MONOLITH
          </p>
          <div className="text-sm text-gray-500 mb-6">
            Текущий статус: {unit.statusProduct}, {unit.disassemblyStatus}
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Создание сценария разборки
            </h1>
            <p className="text-gray-600">
              Создание сценария для разборки товара на составные части
            </p>
          </div>

          {/* Информация о unit */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Информация о товаре для разборки
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Название</div>
                <div className="font-medium text-gray-900">
                  {unit.productName || unit.product?.name}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Артикул</div>
                <div className="font-medium text-gray-900">
                  {unit.product?.code}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Серийный номер</div>
                <div className="font-mono text-gray-900">
                  {unit.serialNumber}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Бренд</div>
                <div className="font-medium text-gray-900">
                  {unit.product?.brand?.name || "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Форма создания сценария */}
          <DisassemblyScenarioForm unit={unit} />
        </div>
      </div>
    </div>
  );
}