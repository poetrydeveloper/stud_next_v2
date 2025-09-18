// //app/lib/productUnitHelpers.ts
// import { ProductUnitStatus, ItemStatus, DeliveryStatus } from "@/app/lib/types/productUnit";

// export const getProductUnitStatusText = (status: ProductUnitStatus): string => {
//   const statusMap: Record<ProductUnitStatus, string> = {
//     'IN_STORE': 'В магазине',
//     'SOLD': 'Продан',
//     'LOST': 'Утерян'
//   };
//   return statusMap[status] || status;
// };

// export const getItemStatusText = (status: ItemStatus): string => {
//   const statusMap: Record<ItemStatus, string> = {
//     'CANDIDATE': 'Кандидат',
//     'IN_REQUEST': 'В заявке',
//     'EXTRA': 'Экстра'
//   };
//   return statusMap[status] || status;
// };

// export const getDeliveryStatusText = (status: DeliveryStatus): string => {
//   const statusMap: Record<DeliveryStatus, string> = {
//     'PARTIAL': 'Частично',
//     'OVER': 'Переполучено',
//     'FULL': 'Полностью',
//     'EXTRA': 'Экстра'
//   };
//   return statusMap[status] || status;
// };

// export const getProductUnitStatusColor = (status: ProductUnitStatus): string => {
//   const colorMap: Record<ProductUnitStatus, string> = {
//     'IN_STORE': 'bg-blue-100 text-blue-800 border-blue-200',
//     'SOLD': 'bg-green-100 text-green-800 border-green-200',
//     'LOST': 'bg-red-100 text-red-800 border-red-200'
//   };
//   return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
// };

// export const getItemStatusColor = (status: ItemStatus): string => {
//   const colorMap: Record<ItemStatus, string> = {
//     'CANDIDATE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
//     'IN_REQUEST': 'bg-blue-100 text-blue-800 border-blue-200',
//     'EXTRA': 'bg-purple-100 text-purple-800 border-purple-200'
//   };
//   return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
// };

// export const formatPrice = (price: number | null): string => {
//   if (price === null || price === undefined) return '0 ₽';
//   return new Intl.NumberFormat('ru-RU', {
//     style: 'currency',
//     currency: 'RUB',
//     minimumFractionDigits: 0
//   }).format(price);
// };

// export const formatDate = (date: Date | null): string => {
//   if (!date) return '-';
//   return new Intl.DateTimeFormat('ru-RU').format(new Date(date));
// };

// export const formatDateTime = (date: Date | null): string => {
//   if (!date) return '-';
//   return new Intl.DateTimeFormat('ru-RU', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit'
//   }).format(new Date(date));
// };

// export const isSerialNumberValid = (serialNumber: string): boolean => {
//   // Пример: PROD123-20250911-153045-AB12CD34
//   const pattern = /^[A-Z0-9]+(-\d+)?-\d{8}-\d{6}-[A-Z0-9]{8}$/;
//   return pattern.test(serialNumber);
// };
// app/lib/productUnitHelpers.ts
export const getProductUnitStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    IN_STORE: 'В магазине',
    SOLD: 'Продан',
    LOST: 'Утерян'
  };
  return statusMap[status] || status;
};

export const getProductUnitStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    IN_STORE: 'border-green-200 bg-green-50 text-green-700',
    SOLD: 'border-blue-200 bg-blue-50 text-blue-700',
    LOST: 'border-red-200 bg-red-50 text-red-700'
  };
  return colorMap[status] || 'border-gray-200 bg-gray-50 text-gray-700';
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(price);
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ru-RU');
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};