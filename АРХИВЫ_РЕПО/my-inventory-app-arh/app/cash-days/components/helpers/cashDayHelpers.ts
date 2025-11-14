// app/cash-days/components/helpers/cashDayHelpers.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(amount);
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getEventTypeConfig = (type: string) => {
  const config: Record<string, { bg: string; text: string; icon: string; label: string }> = {
    SALE: { bg: "bg-green-100", text: "text-green-800", icon: "💰", label: "Продажа" },
    RETURN: { bg: "bg-red-100", text: "text-red-800", icon: "🔄", label: "Возврат" },
    ORDER: { bg: "bg-blue-100", text: "text-blue-800", icon: "📦", label: "Заказ" },
    PRICE_QUERY: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "💬", label: "Запрос цены" }
  };
  return config[type] || { bg: "bg-gray-100", text: "text-gray-800", icon: "📝", label: type };
};