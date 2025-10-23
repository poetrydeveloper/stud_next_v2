// app/product-units/components/unit/CreateRequestModal.tsx
"use client";

import { useState } from "react";

interface ProductUnit {
  id: number;
  serialNumber: string;
  productName?: string;
  productCode?: string;
  product?: {
    name: string;
    code: string;
    brand?: {
      name: string;
    };
  };
}

interface CreateRequestModalProps {
  unit: ProductUnit;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRequestModal({ unit, onClose, onSuccess }: CreateRequestModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const productName = unit.productName || unit.product?.name || "Без названия";
  const productCode = unit.productCode || unit.product?.code || "—";
  const brandName = unit.product?.brand?.name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!pricePerUnit || Number(pricePerUnit) <= 0) {
      setError("Укажите цену за единицу товара");
      return;
    }

    setIsLoading(true);

    try {
      let response;
      
      if (unit.statusCard === "CLEAR") {
        // Перевод CLEAR → CANDIDATE
        response = await fetch("/api/product-units", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            unitId: unit.id, 
            quantity 
          }),
        });
      } else if (unit.statusCard === "CANDIDATE") {
        // Перевод CANDIDATE → IN_REQUEST
        response = await fetch("/api/product-units/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unitId: unit.id,
            quantity,
            pricePerUnit: Number(pricePerUnit)
          }),
        });
      }

      if (!response) {
        throw new Error("Неизвестный статус карточки");
      }

      const data = await response.json();
      
      if (data.ok) {
        onSuccess();
      } else {
        setError(data.error || "Произошла ошибка");
      }
    } catch (err) {
      setError("Произошла ошибка при выполнении операции");
      console.error("CreateRequestModal error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getModalTitle = () => {
    if (unit.statusCard === "CLEAR") return "Добавить в кандидаты";
    if (unit.statusCard === "CANDIDATE") return "Создать заявку";
    return "Операция с товаром";
  };

  const getActionButtonText = () => {
    if (unit.statusCard === "CLEAR") return "Добавить в кандидаты";
    if (unit.statusCard === "CANDIDATE") return "Создать заявку";
    return "Выполнить";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">{getModalTitle()}</h3>

        {/* Информация о товаре */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">{productName}</h4>
            <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
              {unit.serialNumber}
            </span>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div>Артикул: <span className="font-mono">{productCode}</span></div>
            {brandName && <div>Бренд: {brandName}</div>}
            <div>Текущий статус: <span className="font-medium capitalize">{unit.statusCard?.toLowerCase()}</span></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Количество */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Количество единиц
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Цена за единицу (только для кандидатов) */}
          {unit.statusCard === "CANDIDATE" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена за единицу (₽)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Итоговая сумма для заявки */}
          {unit.statusCard === "CANDIDATE" && pricePerUnit && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Итоговая сумма:</span>
                <span className="font-semibold text-blue-700 text-lg">
                  {(quantity * Number(pricePerUnit)).toFixed(2)} ₽
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {quantity} × {Number(pricePerUnit).toFixed(2)} ₽
              </div>
            </div>
          )}

          {/* Сообщение об ошибке */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Выполнение..." : getActionButtonText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}