// app/product-units/components/unit/CreateRequestModal/index.tsx
"use client";

import { useState } from "react";
import ProductInfo from "./ProductInfo";
import PriceForm from "./PriceForm";
import RequestSummary from "./RequestSummary";

interface CreateRequestModalProps {
  unit: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRequestModal({ unit, onClose, onSuccess }: CreateRequestModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!pricePerUnit || Number(pricePerUnit) <= 0) {
      setError("Укажите цену за единицу товара");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/product-units/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId: unit.id,
          quantity,
          pricePerUnit: Number(pricePerUnit)
        }),
      });

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
    return "Создать заявку";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">{getModalTitle()}</h3>
        
        <ProductInfo unit={unit} />
        
        <form onSubmit={handleSubmit}>
          <PriceForm 
            unit={unit}
            quantity={quantity}
            pricePerUnit={pricePerUnit}
            onQuantityChange={setQuantity}
            onPriceChange={setPricePerUnit}
          />
          
          {pricePerUnit && (
            <RequestSummary 
              quantity={quantity}
              pricePerUnit={Number(pricePerUnit)}
            />
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Создание..." : "Создать заявку"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}