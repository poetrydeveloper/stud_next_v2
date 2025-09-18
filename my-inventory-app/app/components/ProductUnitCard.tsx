// // //app/components/ProductunitCard.tsx
// // import { ProductUnit } from "@/app/lib/types/productUnit";
// // import { 
// //   getProductUnitStatusText, 
// //   getProductUnitStatusColor, 
// //   formatPrice, 
// //   formatDateTime,
// //   formatDate 
// // } from '@/app/lib/productUnitHelpers';

// // interface ProductUnitCardProps {
// //   unit: ProductUnit;
// //   onStatusChange?: (unitId: number, newStatus: ProductUnit['status']) => void;
// //   onEdit?: (unit: ProductUnit) => void;
// // }

// // export default function ProductUnitCard({ unit, onStatusChange, onEdit }: ProductUnitCardProps) {
// //   return (
// //     <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
// //       {/* Заголовок с серийным номером и статусом */}
// //       <div className="flex justify-between items-start mb-4">
// //         <div className="flex-1">
// //           <h3 className="font-mono font-semibold text-lg text-gray-800">
// //             {unit.serialNumber}
// //           </h3>
// //           <p className="text-sm text-gray-600 mt-1">{unit.product.name}</p>
// //         </div>
// //         <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getProductUnitStatusColor(unit.status)}`}>
// //           {getProductUnitStatusText(unit.status)}
// //         </span>
// //       </div>

// //       {/* Основная информация */}
// //       <div className="grid grid-cols-2 gap-4 text-sm mb-4">
// //         <div>
// //           <span className="text-gray-500 block text-xs">Код товара:</span>
// //           <p className="font-mono text-gray-800">{unit.product.code}</p>
// //         </div>
        
// //         <div>
// //           <span className="text-gray-500 block text-xs">Дата создания:</span>
// //           <p className="text-gray-800">{formatDateTime(unit.createdAt)}</p>
// //         </div>
        
// //         <div>
// //           <span className="text-gray-500 block text-xs">Категория:</span>
// //           <p className="text-gray-800">{unit.product.category?.name || 'Без категории'}</p>
// //         </div>
        
// //         <div>
// //           <span className="text-gray-500 block text-xs">Цена за единицу:</span>
// //           <p className="text-gray-800">{formatPrice(unit.delivery.pricePerUnit)}</p>
// //         </div>
// //       </div>

// //       {/* Информация о продаже */}
// //       {(unit.status === 'SOLD' && unit.soldAt) && (
// //         <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
// //           <div className="grid grid-cols-2 gap-3 text-sm">
// //             <div>
// //               <span className="text-green-700 block text-xs">Дата продажи:</span>
// //               <p className="text-green-800 font-medium">{formatDateTime(unit.soldAt)}</p>
// //             </div>
// //             {unit.salePrice && (
// //               <div>
// //                 <span className="text-green-700 block text-xs">Цена продажи:</span>
// //                 <p className="text-green-800 font-medium">{formatPrice(unit.salePrice)}</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {/* Информация о доставке */}
// //       <div className="border-t border-gray-200 pt-3">
// //         <span className="text-gray-500 text-xs block mb-2">Информация о поставке:</span>
// //         <div className="grid grid-cols-2 gap-2 text-xs">
// //           <span className="text-gray-600">ID поставки:</span>
// //           <span className="text-gray-800 font-medium">{unit.deliveryId}</span>
          
// //           <span className="text-gray-600">Дата поставки:</span>
// //           <span className="text-gray-800">{formatDate(unit.delivery.deliveryDate)}</span>
          
// //           <span className="text-gray-600">Поставщик:</span>
// //           <span className="text-gray-800">{unit.delivery.supplierName}</span>
          
// //           <span className="text-gray-600">Заказчик:</span>
// //           <span className="text-gray-800">{unit.delivery.customerName}</span>
          
// //           <span className="text-gray-600">Количество:</span>
// //           <span className="text-gray-800">{unit.delivery.quantity} шт.</span>
          
// //           <span className="text-gray-600">Статус поставки:</span>
// //           <span className="text-gray-800">{unit.delivery.status}</span>
// //         </div>
// //       </div>

// //       {/* Кнопки действий */}
// //       {(onStatusChange || onEdit) && (
// //         <div className="border-t border-gray-200 pt-3 mt-3">
// //           <div className="flex space-x-2">
// //             {onStatusChange && unit.status !== 'SOLD' && (
// //               <button
// //                 onClick={() => onStatusChange(unit.id, 'SOLD')}
// //                 className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
// //               >
// //                 Отметить проданным
// //               </button>
// //             )}
// //             {onStatusChange && unit.status !== 'LOST' && (
// //               <button
// //                 onClick={() => onStatusChange(unit.id, 'LOST')}
// //                 className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
// //               >
// //                 Отметить утерянным
// //               </button>
// //             )}
// //             {onStatusChange && (unit.status === 'SOLD' || unit.status === 'LOST') && (
// //               <button
// //                 onClick={() => onStatusChange(unit.id, 'IN_STORE')}
// //                 className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
// //               >
// //                 Вернуть в магазин
// //               </button>
// //             )}
// //             {onEdit && (
// //               <button
// //                 onClick={() => onEdit(unit)}
// //                 className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
// //               >
// //                 Редактировать
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// // app/components/ProductUnitCard.tsx
// import React from "react";

// type ProductUnit = {
//   id: number;
//   serialNumber: string;
//   status: string;
//   salePrice?: number | null;
//   soldAt?: string | null;
//   createdAt: string;
// };

// export default function ProductUnitCard({ unit }: { unit: ProductUnit }) {
//   const statusColors: Record<string, string> = {
//     IN_STORE: "bg-green-100 text-green-700",
//     SOLD: "bg-blue-100 text-blue-700",
//     LOST: "bg-red-100 text-red-700",
//   };

//   return (
//     <div className="flex items-center justify-between border rounded-xl p-4 shadow-sm hover:shadow-md transition">
//       <div>
//         <div className="text-sm text-gray-500">SN: {unit.serialNumber}</div>
//         <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${statusColors[unit.status]}`}>
//           {unit.status}
//         </div>
//       </div>

//       <div className="text-right">
//         <div className="text-gray-700 text-sm">Цена: {unit.salePrice ?? "-"}</div>
//         {unit.soldAt && (
//           <div className="text-gray-500 text-xs">
//             Продано: {new Date(unit.soldAt).toLocaleDateString()} {new Date(unit.soldAt).toLocaleTimeString()}
//           </div>
//         )}
//         <div className="text-gray-400 text-xs">Добавлено: {new Date(unit.createdAt).toLocaleDateString()}</div>
//       </div>
//     </div>
//   );
// }
// app/components/ProductUnitCard.tsx
import { ProductUnit } from "@/app/lib/types/productUnit";
import { 
  getProductUnitStatusText, 
  getProductUnitStatusColor
} from '@/app/lib/productUnitHelpers';

interface ProductUnitCardProps {
  unit: ProductUnit;
  onStatusChange?: (unitId: number, newStatus: ProductUnit['status']) => void;
}

export default function ProductUnitCard({ unit, onStatusChange }: ProductUnitCardProps) {
  const statusColors: Record<string, string> = {
    IN_STORE: "text-green-600",
    SOLD: "text-blue-600", 
    LOST: "text-red-600"
  };

  const statusIcons: Record<string, string> = {
    IN_STORE: "🟢",
    SOLD: "🔵",
    LOST: "🔴"
  };

  return (
    <div className="flex items-center justify-between border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white">
      {/* Левая часть - информация о товаре с картинкой */}
      <div className="flex items-center space-x-4 flex-1">
        {/* Картинка товара */}
        <div className="w-16 h-16 flex items-center justify-center border rounded-md bg-white shrink-0">
          {unit.product.images?.[0] ? (
            <img 
              alt={unit.product.name}
              className="max-w-full max-h-full object-contain"
              src={unit.product.images[0].path}
              onError={(e) => {
                console.error('Image failed to load:', unit.product.images[0].path);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-gray-400 text-xs text-center">Нет фото</div>
          )}
        </div>

        {/* Основная информация */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500">{unit.product.code}</div>
          <div className="font-semibold text-lg truncate">{unit.product.name}</div>
          
          {/* Серийный номер */}
          <div className="text-sm text-gray-600 mt-1">
            SN: <span className="font-mono">{unit.serialNumber}</span>
          </div>

          {/* Статус */}
          <div className={`text-sm ${statusColors[unit.status]} mt-1`}>
            <span className="mr-1">{statusIcons[unit.status]}</span>
            {getProductUnitStatusText(unit.status)}
          </div>

          {/* Цена продажи */}
          {unit.salePrice && (
            <div className="text-sm text-gray-700 mt-1">
              Цена продажи: <span className="font-semibold">{unit.salePrice} ₽</span>
            </div>
          )}
        </div>
      </div>

      {/* Правая часть - даты и кнопки */}
      <div className="flex flex-col items-end space-y-3 ml-4">
        {/* Даты */}
        <div className="text-right space-y-1">
          {unit.soldAt && (
            <div className="text-xs text-gray-500">
              Продано: {new Date(unit.soldAt).toLocaleDateString('ru-RU')}
            </div>
          )}
          <div className="text-xs text-gray-400">
            Создано: {new Date(unit.createdAt).toLocaleDateString('ru-RU')}
          </div>
        </div>

        {/* Кнопки смены статуса */}
        {onStatusChange && (
          <div className="flex flex-col gap-2">
            {unit.status !== 'SOLD' && (
              <button
                onClick={() => onStatusChange(unit.id, 'SOLD')}
                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition whitespace-nowrap"
              >
                Продано
              </button>
            )}
            {unit.status !== 'LOST' && (
              <button
                onClick={() => onStatusChange(unit.id, 'LOST')}
                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition whitespace-nowrap"
              >
                Утеряно
              </button>
            )}
            {(unit.status === 'SOLD' || unit.status === 'LOST') && (
              <button
                onClick={() => onStatusChange(unit.id, 'IN_STORE')}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition whitespace-nowrap"
              >
                В магазин
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}