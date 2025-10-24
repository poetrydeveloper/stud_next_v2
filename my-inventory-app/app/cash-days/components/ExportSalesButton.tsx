// app/cash-days/components/ExportSalesButton.tsx
"use client";

import { useState } from "react";

interface ExportSalesButtonProps {
  cashDayId: number;
}

export default function ExportSalesButton({ cashDayId }: ExportSalesButtonProps) {
  const [exporting, setExporting] = useState(false);

  const exportToExcelFormat = async () => {
    try {
      setExporting(true);
      
      const response = await fetch("/api/cash-days/current/export");
      const result = await response.json();
      
      if (!result.ok) {
        alert("Ошибка экспорта: " + result.error);
        return;
      }

      // Получаем остатки товаров IN_STORE для колонки "остаток"
      const inventoryResponse = await fetch("/api/product-units?status=IN_STORE");
      const inventoryData = await inventoryResponse.json();
      
      // Группируем остатки по коду товара
      const inventoryMap = new Map();
      if (inventoryData.ok) {
        inventoryData.data.forEach((unit: any) => {
          const code = unit.productCode || unit.product?.code;
          if (code) {
            inventoryMap.set(code, (inventoryMap.get(code) || 0) + 1);
          }
        });
      }

      // Формируем содержимое в правильном формате
      const currentDate = new Date().toLocaleDateString('ru-RU');
      
      // Шапка таблицы
      let csvContent = `${currentDate}\t\t\t\t\t\t\t\n`;
      csvContent += "code\tНаименование\t\t\t\tц.пр.\tостаток\n";
      
      // Данные продаж
      const salesData = result.data.sales.filter((sale: any) => sale.код && sale.номер !== result.data.sales.length);
      
      salesData.forEach((sale: any) => {
        const остаток = inventoryMap.get(sale.код) || 0;
        csvContent += `${sale.код}\t${sale.наименование}\t\t\t\t${sale.цена}\t${остаток}\n`;
      });

      // Создаем и скачиваем файл
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/tab-separated-values;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `продажи_${date}.tsv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Экспортировано ${salesData.length} продаж`);
      
    } catch (error) {
      console.error("Export error:", error);
      alert("Ошибка при экспорте");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={exportToExcelFormat}
      disabled={exporting}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
    >
      {exporting ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <span>📊</span>
      )}
      <span>Экспорт в Excel формат</span>
    </button>
  );
}