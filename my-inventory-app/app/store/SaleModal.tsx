// app/store/SaleModal.tsx
"use client";

import { useState, useEffect } from "react";

interface ProductUnit {
  id: number;
  serialNumber: string;
  productName?: string;
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

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: ProductUnit | null;
  onSaleSuccess: () => void;
}

interface CashDayStatus {
  isOpen: boolean;
  currentDay: any | null;
}

export default function SaleModal({ isOpen, onClose, unit, onSaleSuccess }: SaleModalProps) {
  const [salePrice, setSalePrice] = useState<string>("");
  const [buyerName, setBuyerName] = useState<string>("");
  const [buyerPhone, setBuyerPhone] = useState<string>("");
  const [isCredit, setIsCredit] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cashDayStatus, setCashDayStatus] = useState<CashDayStatus>({ isOpen: false, currentDay: null });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Сбрасываем форму при открытии/закрытии
  useEffect(() => {
    if (isOpen && unit) {
      setSalePrice(unit.requestPricePerUnit?.toString() || "");
      setBuyerName("");
      setBuyerPhone("");
      setIsCredit(false);
      setErrors({});
      checkCashDayStatus();
    }
  }, [isOpen, unit]);

  // Проверяем статус кассового дня
  const checkCashDayStatus = async () => {
    try {
      const response = await fetch("/api/cash-days/current");
      const data = await response.json();
      
      if (data.ok) {
        setCashDayStatus({
          isOpen: true,
          currentDay: data.data
        });
      } else {
        setCashDayStatus({
          isOpen: false,
          currentDay: null
        });
      }
    } catch (error) {
      console.error("Ошибка проверки кассового дня:", error);
      setCashDayStatus({
        isOpen: false,
        currentDay: null
      });
    }
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Проверка цены
    const price = parseFloat(salePrice);
    if (!salePrice || isNaN(price) || price < 0) {
      newErrors.salePrice = "Введите корректную цену продажи";
    }

    // Для кредита обязательны имя и телефон
    if (isCredit) {
      if (!buyerName.trim()) {
        newErrors.buyerName = "Имя покупателя обязательно для кредита";
      }
      if (!buyerPhone.trim()) {
        newErrors.buyerPhone = "Телефон покупателя обязателен для кредита";
      }
    }

    // Проверка кассового дня для не-кредитных продаж
    if (!isCredit && price > 0 && !cashDayStatus.isOpen) {
      newErrors.cashDay = "Кассовый день не открыт. Откройте день для продаж за наличные.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка продажи
  const handleSale = async () => {
    if (!unit || !validateForm()) return;

    setIsProcessing(true);
    
    try {
      const price = parseFloat(salePrice);
      
      const response = await fetch(`/api/product-units/${unit.id}/sale`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salePrice: price,
          buyerName: buyerName.trim(),
          buyerPhone: buyerPhone.trim(),
          isCredit
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        // Показываем успешное сообщение
        alert(`✅ Товар успешно ${isCredit ? 'продан в кредит' : 'продан'}!`);
        
        // Закрываем модальное окно и обновляем данные
        onSaleSuccess();
        onClose();
      } else {
        setErrors({ submit: data.error || "Ошибка при выполнении продажи" });
      }
    } catch (error: any) {
      setErrors({ submit: "Ошибка сети: " + error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  // Открыть кассовый день
  const openCashDay = async () => {
    try {
      const response = await fetch("/api/cash-days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await response.json();
      
      if (data.ok) {
        await checkCashDayStatus();
        setErrors(prev => ({ ...prev, cashDay: "" }));
      } else {
        setErrors({ cashDay: "Не удалось открыть кассовый день: " + data.error });
      }
    } catch (error: any) {
      setErrors({ cashDay: "Ошибка сети при открытии дня" });
    }
  };

  // Если модальное окно закрыто или unit не передан
  if (!isOpen || !unit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isCredit ? "💳 Продажа в кредит" : "💰 Продажа товара"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isProcessing}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">📦</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {unit.productName || unit.product?.name || "Без названия"}
              </h3>
              <div className="mt-1 text-xs text-gray-600 space-y-1">
                <div className="flex items-center space-x-2">
                  <span>Артикул:</span>
                  <span className="font-mono bg-white px-1 rounded">
                    {unit.productCode || unit.product?.code || "—"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Серийный номер:</span>
                  <span className="font-mono bg-white px-1 rounded">
                    {unit.serialNumber}
                  </span>
                </div>
                {unit.product?.brand?.name && (
                  <div className="flex items-center space-x-2">
                    <span>Бренд:</span>
                    <span className="bg-white px-1 rounded">
                      {unit.product.brand.name}
                    </span>
                  </div>
                )}
                {unit.requestPricePerUnit && (
                  <div className="flex items-center space-x-2">
                    <span>Цена закупки:</span>
                    <span className="font-semibold text-green-600">
                      {unit.requestPricePerUnit} ₽
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Форма продажи */}
        <div className="p-6 space-y-4">
          {/* Цена продажи */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена продажи *
            </label>
            <div className="relative">
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.salePrice ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isProcessing}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500">₽</span>
              </div>
            </div>
            {errors.salePrice && (
              <p className="mt-1 text-sm text-red-600">{errors.salePrice}</p>
            )}
          </div>

          {/* Переключатель кредит/наличные */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Тип оплаты</span>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsCredit(false)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  !isCredit 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={isProcessing}
              >
                💰 Наличные
              </button>
              <button
                type="button"
                onClick={() => setIsCredit(true)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  isCredit 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={isProcessing}
              >
                💳 Кредит
              </button>
            </div>
          </div>

          {/* Поля для кредита */}
          {isCredit && (
            <div className="space-y-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя покупателя *
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Введите имя покупателя"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.buyerName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isProcessing}
                />
                {errors.buyerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.buyerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон покупателя *
                </label>
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+7 (XXX) XXX-XX-XX"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.buyerPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isProcessing}
                />
                {errors.buyerPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.buyerPhone}</p>
                )}
              </div>
            </div>
          )}

          {/* Статус кассового дня */}
          {!isCredit && parseFloat(salePrice) > 0 && (
            <div className={`p-3 rounded-lg border ${
              cashDayStatus.isOpen 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    cashDayStatus.isOpen ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {cashDayStatus.isOpen ? '🟢 День открыт' : '🔴 День закрыт'}
                  </span>
                </div>
                {!cashDayStatus.isOpen && (
                  <button
                    onClick={openCashDay}
                    disabled={isProcessing}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    Открыть
                  </button>
                )}
              </div>
              {errors.cashDay && (
                <p className="mt-1 text-sm text-red-600">{errors.cashDay}</p>
              )}
            </div>
          )}

          {/* Общая ошибка */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Футер с кнопками */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between space-x-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSale}
              disabled={isProcessing}
              className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center space-x-2 ${
                isCredit ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Обработка...</span>
                </>
              ) : (
                <>
                  <span>{isCredit ? '💳' : '💰'}</span>
                  <span>{isCredit ? 'Продать в кредит' : 'Продать'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}