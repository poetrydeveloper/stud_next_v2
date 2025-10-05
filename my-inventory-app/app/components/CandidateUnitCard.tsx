// app/components/CandidateUnitCard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CandidateUnitCardProps {
  unit: {
    id: number;
    serialNumber: string;
    productName?: string;
    product?: {
      id: number;
      name: string;
      code: string;
      description?: string;
      images?: Array<{
        id: number;
        path: string;
        isMain: boolean;
      }>;
      spine?: {
        id: number;
        name: string;
      };
      category?: {
        name: string;
      };
      brand?: {
        name: string;
      };
    };
    quantityInCandidate?: number;
    createdAtCandidate?: string;
    statusCard?: string;
    spine?: {
      id: number;
      name: string;
    };
    requestPricePerUnit?: number;
    logs?: Array<{
      id: number;
      type: string;
      message: string;
      createdAt: string;
    }>;
  };
  onAddToRequest?: (unitId: number, quantity: number, pricePerUnit: number) => void;
}

interface Log {
  id: number;
  type: string;
  message: string;
  createdAt: string;
  meta?: any;
}

export default function CandidateUnitCard({ unit, onAddToRequest }: CandidateUnitCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(unit.requestPricePerUnit || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const router = useRouter();

  // Получаем основное изображение
  const mainImage = unit.product?.images?.find(img => img.isMain) || unit.product?.images?.[0];
  
  // Форматируем дату
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Загрузка логов
  const loadLogs = async (unitId: number) => {
    setLoadingLogs(true);
    try {
      const response = await fetch(`/api/product-units/${unitId}/logs`);
      const data = await response.json();
      if (data.ok) {
        setLogs(data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки логов:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Автоматическая загрузка логов при открытии деталей
  useEffect(() => {
    if (showDetails && showLogs) {
      loadLogs(unit.id);
    }
  }, [showDetails, showLogs, unit.id]);

  // Статус баджи с цветами
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      CANDIDATE: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Кандидат' },
      CLEAR: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Чистый' },
      SPROUTED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Проросший' },
      IN_REQUEST: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'В заявке' },
      IN_DELIVERY: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'В доставке' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.CANDIDATE;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) setQuantity(value);
  };

  const handlePriceChange = (value: number) => {
    if (value >= 0) setPricePerUnit(Number(value.toFixed(2)));
  };

  const handlePriceStep = (step: number) => {
    setPricePerUnit(prev => Number((prev + step).toFixed(2)));
  };

  const handleAddToRequest = async () => {
  console.log("🎯 [CARD] Нажата кнопка 'В заявку'");
  console.log("📊 [CARD] Данные формы:", { 
    unitId: unit.id, 
    quantity, 
    pricePerUnit 
  });

  if (quantity < 1) {
    console.error("❌ [CARD] Количество должно быть >= 1");
    alert("❌ Укажите количество товара");
    return;
  }

  if (pricePerUnit <= 0) {
    console.error("❌ [CARD] Цена должна быть > 0");
    alert("❌ Укажите цену за единицу товара");
    return;
  }

  if (!onAddToRequest) {
    console.error("❌ [CARD] onAddToRequest callback не передан");
    alert("❌ Ошибка: функция обработки заявки не настроена");
    return;
  }

  console.log("✅ [CARD] Валидация пройдена, вызываем onAddToRequest...");
  
  setIsSubmitting(true);
  try {
    await onAddToRequest(unit.id, quantity, pricePerUnit);
    console.log("✅ [CARD] onAddToRequest выполнен успешно");
  } catch (error) {
    console.error("❌ [CARD] Ошибка в onAddToRequest:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleSpineClick = (spineId: number) => {
    router.push(`/spines/${spineId}`);
  };

  const handleShowLogs = () => {
    const newShowLogs = !showLogs;
    setShowLogs(newShowLogs);
    // Если открываем логи и они еще не загружены - загружаем
    if (newShowLogs && logs.length === 0) {
      loadLogs(unit.id);
    }
  };

  // Рассчитываем общую сумму
  const totalAmount = quantity * pricePerUnit;

  return (
    <>
      {/* Основная карточка */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 w-full">
        <div className="flex gap-3">
          {/* Маленькое изображение */}
          <div 
            className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border border-gray-200"
            onClick={() => setShowImageModal(true)}
          >
            {mainImage ? (
              <img
                src={mainImage.path}
                alt={unit.productName || unit.product?.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Основной контент */}
          <div className="flex-1 min-w-0">
            {/* Первая строка: Название и статус */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {unit.productName || unit.product?.name || "Без названия"}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border">
                    Арт: {unit.product?.code || "—"}
                  </span>
                  <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded border hidden sm:inline">
                    {unit.serialNumber}
                  </span>
                </div>
              </div>
              {getStatusBadge(unit.statusCard || "CANDIDATE")}
            </div>

            {/* Вторая строка: Spine и дата */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {unit.product?.spine && (
                  <button
                    onClick={() => handleSpineClick(unit.product!.spine!.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-1 rounded border transition-colors"
                    title={unit.product.spine.name}
                  >
                    📋 {unit.product.spine.name}
                  </button>
                )}
                {unit.product?.brand && (
                  <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border">
                    🏷️ {unit.product.brand.name}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                📅 {unit.createdAtCandidate ? formatDate(unit.createdAtCandidate) : ""}
              </span>
            </div>

            {/* Форма заявки */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Поле количества */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">
                    📦 Кол-во, шт.
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors rounded-l-lg"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-12 text-center border-x border-gray-300 py-2 text-sm font-medium bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Поле цены */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">
                    💰 Цена за шт., ₽
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      type="button"
                      onClick={() => handlePriceStep(-1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors rounded-l-lg"
                      disabled={pricePerUnit <= 0}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={pricePerUnit}
                      onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                      className="w-20 text-center border-x border-gray-300 py-2 text-sm font-medium bg-white"
                      placeholder="0.00"
                    />
                    <button
                      type="button"
                      onClick={() => handlePriceStep(1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Общая сумма */}
              {pricePerUnit > 0 && quantity > 0 && (
                <div className="text-center">
                  <span className="text-xs text-gray-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    💵 Общая сумма: <strong>{totalAmount.toFixed(2)} ₽</strong>
                  </span>
                </div>
              )}

              {/* Кнопки действий */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddToRequest}
                  disabled={isSubmitting || quantity < 1 || pricePerUnit <= 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Создание...
                    </>
                  ) : (
                    <>
                      📋 В заявку
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {showDetails ? "▲ Скрыть" : "▼ Подробнее"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная информация (раскрывается по кнопке) */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {/* Серийный номер для мобильных */}
            <div className="sm:hidden mb-3">
              <div className="text-xs text-gray-500 mb-1 font-medium">🔢 Серийный номер:</div>
              <span className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-2 rounded border block text-center">
                {unit.serialNumber}
              </span>
            </div>

            {/* Описание товара */}
            {unit.product?.description && (
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1 font-medium">📝 Описание:</div>
                <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border">
                  {unit.product.description}
                </div>
              </div>
            )}

            {/* Категория */}
            {unit.product?.category && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-500 font-medium">📂 Категория:</span>
                <span className="text-xs text-gray-700 bg-gray-100 px-3 py-1 rounded border">
                  {unit.product.category.name}
                </span>
              </div>
            )}

            {/* Кнопка просмотра логов */}
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={handleShowLogs}
                disabled={loadingLogs}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium disabled:opacity-50 flex items-center gap-1"
              >
                📊 {loadingLogs ? "Загрузка..." : (showLogs ? "Скрыть логи" : "Показать логи")} 
                {logs.length > 0 && ` (${logs.length})`}
              </button>
            </div>

            {/* Логи */}
            {showLogs && (
              <div className="mt-2 max-h-40 overflow-y-auto">
                <div className="text-xs text-gray-500 mb-2 font-medium">🕒 История изменений:</div>
                {loadingLogs ? (
                  <div className="text-xs text-gray-500 text-center py-3 bg-gray-50 rounded border">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
                    Загрузка логов...
                  </div>
                ) : logs.length > 0 ? (
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div key={log.id} className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium bg-white px-2 py-1 rounded text-xs border">
                            {log.type}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(log.createdAt).toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <div className="text-xs leading-relaxed">{log.message}</div>
                        {log.meta && (
                          <div className="mt-1 text-xs text-gray-500 bg-white p-1 rounded border">
                            {JSON.stringify(log.meta, null, 2)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 text-center py-3 bg-gray-50 rounded border">
                    📭 Логи отсутствуют
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Модальное окно для изображения */}
      {showImageModal && mainImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 cursor-pointer"
          onClick={() => setShowImageModal(false)}
        >
          <div className="max-w-4xl max-h-full bg-white rounded-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {unit.productName || unit.product?.name}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                onClick={() => setShowImageModal(false)}
              >
                ×
              </button>
            </div>
            <img
              src={mainImage.path}
              alt={unit.productName || unit.product?.name}
              className="max-w-full max-h-[70vh] object-contain rounded border"
            />
          </div>
        </div>
      )}
    </>
  );
}