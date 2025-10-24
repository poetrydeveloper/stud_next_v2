// app/cash-days/components/CashEventItem.tsx
import { CashEvent } from './types';
import { formatCurrency, formatDateTime, getEventTypeConfig } from './helpers/cashDayHelpers';

interface CashEventItemProps {
  event: CashEvent;
  onReturn: (eventId: number, productUnitId: number, productName: string) => void;
}

export default function CashEventItem({ event, onReturn }: CashEventItemProps) {
  const typeConfig = getEventTypeConfig(event.type);

  const handleReturn = () => {
    if (event.productUnit) {
      onReturn(event.id, event.productUnit.id, event.productUnit.productName || 'товар');
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        {/* Изображение товара */}
        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
          {event.productUnit?.product?.images?.[0] ? (
            <img
              src={event.productUnit.product.images[0].path}
              alt={event.productUnit.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-2xl">📦</span>
            </div>
          )}
        </div>

        {/* Информация о событии */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${typeConfig.bg} ${typeConfig.text}`}>
                <span className="mr-1">{typeConfig.icon}</span>
                {typeConfig.label}
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(event.amount)}
              </span>
            </div>
            <span className="text-sm text-gray-500 flex-shrink-0">
              {formatDateTime(event.createdAt)}
            </span>
          </div>

          <p className="text-gray-700 mb-3">
            {event.notes}
          </p>

          {/* Информация о товаре */}
          {event.productUnit && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {event.productUnit.productName || event.productUnit.product?.name || "Без названия"}
                    </h4>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border font-mono">
                      {event.productUnit.serialNumber}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>Арт: {event.productUnit.productCode || event.productUnit.product?.code || "—"}</span>
                    {event.productUnit.salePrice && (
                      <span className="text-green-600 font-semibold">
                        Цена: {formatCurrency(event.productUnit.salePrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  {event.type === 'SALE' && (
                    <>
                      <button
                        className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                        onClick={handleReturn}
                      >
                        ↩️ Возврат
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => alert("Функция перезаказа в разработке")}
                      >
                        📦 Заказать
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}