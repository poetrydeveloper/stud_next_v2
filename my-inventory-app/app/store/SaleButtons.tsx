// app/store/SaleButtons.tsx (обновленная версия)
"use client";

import { useState } from "react";
import SaleModal from "./SaleModal";

interface ProductUnit {
  id: number;
  statusProduct: string;
  productName?: string;
  serialNumber: string;
  productCode?: string;
  requestPricePerUnit?: number;
  product?: {
    name: string;
    code: string;
    brand?: {
      name: string;
    };
  };
}

interface SaleButtonsProps {
  unit: ProductUnit;
  onSaleSuccess: () => void;
}

export default function SaleButtons({ unit, onSaleSuccess }: SaleButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saleType, setSaleType] = useState<'CASH' | 'CREDIT' | null>(null);

  const handleSaleClick = (isCredit: boolean = false) => {
    setSaleType(isCredit ? 'CREDIT' : 'CASH');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSaleType(null);
  };

  const handleSaleSuccess = () => {
    onSaleSuccess();
    handleModalClose();
  };

  // Для проданных товаров показываем информацию
  if (unit.statusProduct === "SOLD" || unit.statusProduct === "CREDIT") {
    return (
      <div className="text-right text-xs">
        <div className="text-gray-600 mb-1">
          {unit.statusProduct === "SOLD" ? "✅ Продано" : "💳 В кредите"}
        </div>
      </div>
    );
  }

  // Только для товаров на складе показываем кнопки продажи
  if (unit.statusProduct !== "IN_STORE") {
    return null;
  }

  return (
    <>
      <div className="flex flex-col space-y-2">
        <button 
          onClick={() => handleSaleClick(false)}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 min-w-[100px] justify-center"
        >
          <span>💰</span>
          <span>Продать</span>
        </button>
        <button 
          onClick={() => handleSaleClick(true)}
          className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 min-w-[100px] justify-center"
        >
          <span>💳</span>
          <span>Кредит</span>
        </button>
      </div>

      <SaleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        unit={unit}
        onSaleSuccess={handleSaleSuccess}
      />
    </>
  );
}