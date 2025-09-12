import { ProductUnit } from "@/app/lib/types/productUnit";
import { 
  getProductUnitStatusText, 
  getProductUnitStatusColor, 
  formatPrice, 
  formatDateTime,
  formatDate 
} from '@/app/lib/productUnitHelpers';

interface ProductUnitCardProps {
  unit: ProductUnit;
  onStatusChange?: (unitId: number, newStatus: ProductUnit['status']) => void;
  onEdit?: (unit: ProductUnit) => void;
}

export default function ProductUnitCard({ unit, onStatusChange, onEdit }: ProductUnitCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Заголовок с серийным номером и статусом */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-mono font-semibold text-lg text-gray-800">
            {unit.serialNumber}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{unit.product.name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getProductUnitStatusColor(unit.status)}`}>
          {getProductUnitStatusText(unit.status)}
        </span>
      </div>

      {/* Основная информация */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-gray-500 block text-xs">Код товара:</span>
          <p className="font-mono text-gray-800">{unit.product.code}</p>
        </div>
        
        <div>
          <span className="text-gray-500 block text-xs">Дата создания:</span>
          <p className="text-gray-800">{formatDateTime(unit.createdAt)}</p>
        </div>
        
        <div>
          <span className="text-gray-500 block text-xs">Категория:</span>
          <p className="text-gray-800">{unit.product.category?.name || 'Без категории'}</p>
        </div>
        
        <div>
          <span className="text-gray-500 block text-xs">Цена за единицу:</span>
          <p className="text-gray-800">{formatPrice(unit.delivery.pricePerUnit)}</p>
        </div>
      </div>

      {/* Информация о продаже */}
      {(unit.status === 'SOLD' && unit.soldAt) && (
        <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-green-700 block text-xs">Дата продажи:</span>
              <p className="text-green-800 font-medium">{formatDateTime(unit.soldAt)}</p>
            </div>
            {unit.salePrice && (
              <div>
                <span className="text-green-700 block text-xs">Цена продажи:</span>
                <p className="text-green-800 font-medium">{formatPrice(unit.salePrice)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Информация о доставке */}
      <div className="border-t border-gray-200 pt-3">
        <span className="text-gray-500 text-xs block mb-2">Информация о поставке:</span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <span className="text-gray-600">ID поставки:</span>
          <span className="text-gray-800 font-medium">{unit.deliveryId}</span>
          
          <span className="text-gray-600">Дата поставки:</span>
          <span className="text-gray-800">{formatDate(unit.delivery.deliveryDate)}</span>
          
          <span className="text-gray-600">Поставщик:</span>
          <span className="text-gray-800">{unit.delivery.supplierName}</span>
          
          <span className="text-gray-600">Заказчик:</span>
          <span className="text-gray-800">{unit.delivery.customerName}</span>
          
          <span className="text-gray-600">Количество:</span>
          <span className="text-gray-800">{unit.delivery.quantity} шт.</span>
          
          <span className="text-gray-600">Статус поставки:</span>
          <span className="text-gray-800">{unit.delivery.status}</span>
        </div>
      </div>

      {/* Кнопки действий */}
      {(onStatusChange || onEdit) && (
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex space-x-2">
            {onStatusChange && unit.status !== 'SOLD' && (
              <button
                onClick={() => onStatusChange(unit.id, 'SOLD')}
                className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
              >
                Отметить проданным
              </button>
            )}
            {onStatusChange && unit.status !== 'LOST' && (
              <button
                onClick={() => onStatusChange(unit.id, 'LOST')}
                className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
              >
                Отметить утерянным
              </button>
            )}
            {onStatusChange && (unit.status === 'SOLD' || unit.status === 'LOST') && (
              <button
                onClick={() => onStatusChange(unit.id, 'IN_STORE')}
                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Вернуть в магазин
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(unit)}
                className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
              >
                Редактировать
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
