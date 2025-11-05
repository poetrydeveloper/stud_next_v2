// app/product-units/components/unit/UnitMiniCard.tsx
"use client";

import { useState } from "react";
import CreateRequestModal from "./CreateRequestModal";

interface ProductUnit {
  id: number;
  serialNumber: string;
  statusCard: string;
  statusProduct?: string;
  productName?: string;
  productCode?: string;
  requestPricePerUnit?: number;
  quantityInRequest?: number;
  updatedAt?: string;
  soldAt?: string;
  createdAt?: string;
  product?: {
    name: string;
    code: string;
    brand?: {
      name: string;
    };
    images?: Array<{
      path: string;
      isMain: boolean;
      localPath?: string;
    }>;
  };
}

interface UnitMiniCardProps {
  unit: ProductUnit;
  onStatusChange?: (unitId: number, newStatus: string) => void;
  onSpineRefresh?: () => void;
  onStatsUpdate?: (type: 'candidate' | 'request', delta: number) => void;
}

const isRecentlyActive = (unit: ProductUnit) => {
  if (!unit.updatedAt) return false;
  return Date.now() - new Date(unit.updatedAt).getTime() < 3 * 60 * 1000; // 3 минуты
};

const isRecentlySold = (unit: ProductUnit) => {
  if (!unit.soldAt) return false;
  return Date.now() - new Date(unit.soldAt).getTime() < 60 * 60 * 1000; // 60 минут
};

export default function UnitMiniCard({ unit, onStatusChange, onSpineRefresh, onStatsUpdate }: UnitMiniCardProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentCardStatus, setCurrentCardStatus] = useState(unit.statusCard);
  const [currentProductStatus, setCurrentProductStatus] = useState(unit.statusProduct);
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ ВАЖНО: СКРЫВАЕМ SPROUTED КАРТОЧКИ
  if (currentCardStatus === "SPROUTED") {
    return null; // Не рендерим вообще
  }

  const mainImage = unit.product?.images?.find(img => img.isMain) || unit.product?.images?.[0];
  const imagePath = mainImage?.localPath || mainImage?.path;
  const productName = unit.productName || unit.product?.name || "Без названия";
  const productCode = unit.productCode || unit.product?.code || "—";
  const brandName = unit.product?.brand?.name;

  // Конфиг для карточных статусов
  const getCardStatusConfig = (status: string) => {
    const configs = {
      CLEAR: { bg: 'bg-green-100', text: 'text-green-800', label: 'CLEAR', icon: '🟢', cardBg: 'bg-white' },
      CANDIDATE: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'CANDIDATE', icon: '🟣', cardBg: 'bg-purple-50' },
      SPROUTED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'SPROUTED', icon: '🔵', cardBg: 'bg-blue-50' },
      IN_REQUEST: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'IN_REQUEST', icon: '🟠', cardBg: 'bg-orange-50' },
      IN_DELIVERY: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'IN_DELIVERY', icon: '🟡', cardBg: 'bg-yellow-50' },
      ARRIVED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'ARRIVED', icon: '⚫', cardBg: 'bg-gray-50' },
    };

    return configs[status as keyof typeof configs] || 
           { bg: 'bg-gray-100', text: 'text-gray-800', label: status, icon: '❓', cardBg: 'bg-white' };
  };

  // Конфиг для физических статусов
  const getProductStatusConfig = (status: string) => {
    const configs = {
      IN_STORE: { bg: 'bg-green-100', text: 'text-green-800', label: 'IN_STORE', icon: '📦' },
      SOLD: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'SOLD', icon: '💰' },
      CREDIT: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'CREDIT', icon: '💳' },
      LOST: { bg: 'bg-red-100', text: 'text-red-800', label: 'LOST', icon: '❌' },
      IN_DISASSEMBLED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'DISASSEMBLED', icon: '🔧' },
      IN_COLLECTED: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'COLLECTED', icon: '🔄' },
    };

    return configs[status as keyof typeof configs] || 
           { bg: 'bg-gray-100', text: 'text-gray-800', label: status, icon: '❓' };
  };

  const cardStatusConfig = getCardStatusConfig(currentCardStatus);
  const productStatusConfig = currentProductStatus ? getProductStatusConfig(currentProductStatus) : null;

  const handleAddToCandidate = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch("/api/product-units", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId: unit.id }),
      });

      if (response.ok) {
        setCurrentCardStatus("CANDIDATE");
        onStatsUpdate?.('candidate', 1);
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToRequest = () => {
    setShowRequestModal(true);
  };

  const handleDelivery = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/product-units/${unit.id}/delivery`, {
        method: "PATCH",
      });

      const data = await response.json();
      
      if (data.ok) {
        // После поставки статус карты становится IN_DELIVERY
        setCurrentCardStatus("IN_DELIVERY");
        // ❌ УБРАЛИ onStatusChange - он вызывает перезагрузку
      } else {
        alert(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      console.error("Delivery error:", error);
      alert("Ошибка при поставке");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevertToRequest = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/product-units/revert-to-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId: unit.id }),
      });

      const data = await response.json();
      
      if (data.ok) {
        setCurrentCardStatus("IN_REQUEST");
        setCurrentProductStatus(null);
        // ❌ УБРАЛИ onStatusChange - он вызывает перезагрузку
      } else {
        alert(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      console.error("Revert error:", error);
      alert("Ошибка при откате");
    } finally {
      setIsProcessing(false);
    }
  };

  // Определяем, показывать ли кнопку отката
  const shouldShowRevert = currentProductStatus === "IN_STORE" || currentCardStatus === "ARRIVED";

  return (
    <>
      <div className={`
      rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow 
      ${cardStatusConfig.cardBg}
      ${isRecentlyActive(unit) ? 'border-2 border-dashed border-blue-500 animate-pulse' : ''}
      ${isRecentlySold(unit) ? 'border-t-2 border-dashed border-green-500' : ''}
    `}>
        <div className="flex items-start space-x-3 mb-2">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded border overflow-hidden">
              {imagePath ? (
                <img src={imagePath} alt={productName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">📦</div>
              )}
            </div>
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h5 className="font-medium text-gray-900 text-sm truncate" title={productName}>{productName}</h5>
              <button onClick={() => setIsExpanded(!isExpanded)} className="flex-shrink-0 text-gray-400 hover:text-gray-600 ml-1">
                {isExpanded ? '▲' : '▼'}
              </button>
            </div>
            
            <div className="flex items-center space-x-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${cardStatusConfig.bg} ${cardStatusConfig.text}`}>
                {cardStatusConfig.icon} {cardStatusConfig.label}
              </span>
              
              {productStatusConfig && (
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${productStatusConfig.bg} ${productStatusConfig.text}`}>
                  {productStatusConfig.icon} {productStatusConfig.label}
                </span>
              )}
            </div>

            {/* ЦЕНА ДЛЯ IN_REQUEST */}
            {currentCardStatus === "IN_REQUEST" && unit.requestPricePerUnit && (
              <div className="text-xs font-semibold text-green-600 mb-1">
                💰 {unit.requestPricePerUnit} ₽
              </div>
            )}

            {brandName && <div className="text-xs text-gray-600">🏷️ {brandName}</div>}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
            <div className="text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Артикул:</span>
                <span className="font-mono">{productCode}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Серийный:</span>
                <span className="font-mono text-xs">{unit.serialNumber}</span>
              </div>
            </div>
            
            <div className="flex gap-1">
              {currentCardStatus === "CLEAR" && (
                <button 
                  onClick={handleAddToCandidate} 
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded transition-colors disabled:opacity-50"
                >
                  {isProcessing ? "..." : "В кандидаты"}
                </button>
              )}
              
              {currentCardStatus === "CANDIDATE" && (
                <button 
                  onClick={handleAddToRequest} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors"
                >
                  В заявку
                </button>
              )}

              {currentCardStatus === "IN_REQUEST" && (
                <button 
                  onClick={handleDelivery} 
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded transition-colors disabled:opacity-50"
                >
                  {isProcessing ? "Поставка..." : "Поставить"}
                </button>
              )}

              {shouldShowRevert && (
                <button 
                  onClick={handleRevertToRequest} 
                  disabled={isProcessing}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-1 px-2 rounded transition-colors disabled:opacity-50"
                >
                  {isProcessing ? "Откат..." : "Откат"}
                </button>
              )}

              <button onClick={() => {}} className="bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded transition-colors">
                Подробнее
              </button>
            </div>
          </div>
        )}

        {/* КОМПАКТНЫЕ КНОПКИ (БЕЗ РАСШИРЕНИЯ) */}
        {!isExpanded && (
          <div className="flex gap-1 mt-2">
            {currentCardStatus === "CLEAR" && (
              <button 
                onClick={handleAddToCandidate} 
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded transition-colors disabled:opacity-50"
              >
                {isProcessing ? "..." : "В кандидаты"}
              </button>
            )}
            
            {currentCardStatus === "CANDIDATE" && (
              <button onClick={handleAddToRequest} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors">
                В заявку
              </button>
            )}

            {currentCardStatus === "IN_REQUEST" && (
              <button 
                onClick={handleDelivery} 
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded transition-colors disabled:opacity-50"
              >
                {isProcessing ? "..." : "Поставить"}
              </button>
            )}

            {shouldShowRevert && (
              <button 
                onClick={handleRevertToRequest} 
                disabled={isProcessing}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-1 px-2 rounded transition-colors disabled:opacity-50"
              >
                {isProcessing ? "..." : "Откат"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* МОДАЛЬНОЕ ОКНО ЗАЯВКИ */}
      {showRequestModal && currentCardStatus === "CANDIDATE" && (
        <CreateRequestModal
          unit={{
            ...unit,
            statusCard: currentCardStatus
          }}
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
            setCurrentCardStatus("IN_REQUEST");
            onStatsUpdate?.('request', -1);
            onSpineRefresh?.();
          }}
        />
      )}
    </>
  );
}