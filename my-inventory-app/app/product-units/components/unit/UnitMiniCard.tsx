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
}

export default function UnitMiniCard({ unit, onStatusChange }: UnitMiniCardProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(unit.statusCard);

  const mainImage = unit.product?.images?.find(img => img.isMain) || unit.product?.images?.[0];
  const imagePath = mainImage?.localPath || mainImage?.path;
  const productName = unit.productName || unit.product?.name || "Без названия";
  const productCode = unit.productCode || unit.product?.code || "—";
  const brandName = unit.product?.brand?.name;

  const getStatusConfig = (status: string) => {
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

  const statusConfig = getStatusConfig(currentStatus);

  const handleAddToCandidate = async () => {
    try {
      const response = await fetch("/api/product-units", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId: unit.id }),
      });

      if (response.ok) {
        setCurrentStatus("CANDIDATE");
        onStatusChange?.(unit.id, "CANDIDATE");
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddToRequest = () => {
    setShowRequestModal(true);
  };

  return (
    <>
      <div className={`rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow ${statusConfig.cardBg}`}>
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
              <span className="text-xs font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{unit.serialNumber}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                {statusConfig.icon} {statusConfig.label}
              </span>
            </div>

            {brandName && <div className="text-xs text-gray-600">🏷️ {brandName}</div>}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
            <div className="text-xs text-gray-600">
              <div className="flex justify-between"><span>Артикул:</span><span className="font-mono">{productCode}</span></div>
            </div>
            <div className="flex gap-1">
              {currentStatus === "CLEAR" && (
                <button onClick={handleAddToCandidate} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded transition-colors">
                  В кандидаты
                </button>
              )}
              {currentStatus === "CANDIDATE" && (
                <button onClick={handleAddToRequest} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors">
                  В заявку
                </button>
              )}
              <button onClick={() => {}} className="bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded transition-colors">
                Подробнее
              </button>
            </div>
          </div>
        )}

        {!isExpanded && (
          <div className="flex gap-1 mt-2">
            {currentStatus === "CLEAR" && (
              <button onClick={handleAddToCandidate} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded transition-colors">
                В кандидаты
              </button>
            )}
            {currentStatus === "CANDIDATE" && (
              <button onClick={handleAddToRequest} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors">
                В заявку
              </button>
            )}
          </div>
        )}
      </div>

      {showRequestModal && currentStatus === "CANDIDATE" && (
        <CreateRequestModal
          unit={unit}
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
            setCurrentStatus("IN_REQUEST");
            onStatusChange?.(unit.id, "IN_REQUEST");
          }}
        />
      )}
    </>
  );
}