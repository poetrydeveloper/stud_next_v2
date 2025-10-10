// app/store/SaleButtons.tsx (ОБНОВЛЕННАЯ - КОМПАКТНЫЙ МАКЕТ)
"use client";

import { useState } from "react";
import SaleModal from "./SaleModal";
import DisassemblyButtons from "./DisassemblyButtons";

interface ProductUnit {
  id: number;
  statusProduct: string;
  disassemblyStatus: string;
  isParsingAlgorithm: boolean;
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
        <div className="text-gray-600">
          {unit.statusProduct === "SOLD" ? "✅ Продано" : "💳 В кредите"}
        </div>
      </div>
    );
  }

  // Только для товаров на складе показываем кнопки
  if (unit.statusProduct !== "IN_STORE") {
    return null;
  }

  return (
    <>
      <div className="flex flex-col space-y-2 min-w-[80px]">
        {/* Кнопки продажи - компактные */}
        <div className="flex flex-col space-y-1">
          <button 
            onClick={() => handleSaleClick(false)}
            className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors flex items-center space-x-1 justify-center"
          >
            <span className="text-xs">💰</span>
            <span>Продать</span>
          </button>
          <button 
            onClick={() => handleSaleClick(true)}
            className="px-2 py-1 bg-orange-600 text-white text-xs font-medium rounded hover:bg-orange-700 transition-colors flex items-center space-x-1 justify-center"
          >
            <span className="text-xs">💳</span>
            <span>Кредит</span>
          </button>
        </div>

        {/* Кнопки разборки - компактные */}
        <DisassemblyButtons 
          unit={unit}
          onOperationSuccess={onSaleSuccess}
        />
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