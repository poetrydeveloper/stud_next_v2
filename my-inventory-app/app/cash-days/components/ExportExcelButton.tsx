// app/cash-days/components/ExportExcelButton.tsx
"use client";

import { useState } from "react";
import * as XLSX from 'xlsx';

interface ExportExcelButtonProps {
  cashDayId: number;
}

export default function ExportExcelButton({ cashDayId }: ExportExcelButtonProps) {
  const [exporting, setExporting] = useState(false);

  const exportToExcel = async () => {
    try {
      setExporting(true);
      
      // Получаем данные продаж
      const response = await fetch("/api/cash-days/current/export");
      const result = await response.json();

      if (!result.ok) {
        alert("Ошибка экспорта: " + result.error);
        return;
      }

      if (!result.data.sales || result.data.sales.length === 0) {
        alert("Нет данных для экспорта");
        return;
      }

      // Получаем остатки товаров IN_STORE
      const inventoryResponse = await fetch("/api/product-units?status=IN_STORE");
      const inventoryData = await inventoryResponse.json();
      
      // Создаем карту остатков
      const inventoryMap = new Map();
      if (inventoryData.ok && inventoryData.data) {
        inventoryData.data.forEach((item: any) => {
          inventoryMap.set(item.code, item.count);
        });
      }

      // Формируем данные для Excel
      const currentDate = new Date().toLocaleDateString('ru-RU');
      
      // Заголовок таблицы - 6 колонок: code, наименование, 4 пустые, ц.пр., остаток
      const headerRow = ['code', 'Наименование', '', '', '', '', 'ц.пр.', 'остаток'];
      
      // Данные продаж (исключаем итоговую строку если есть)
      const salesData = result.data.sales.filter((sale: any) => 
        sale.код && sale.код !== 'БЕЗ_КОДА' && sale.наименование !== 'ИТОГО:'
      );

      // Преобразуем данные в формат для Excel
      const excelData = [
        [currentDate], // Первая строка - дата
        [], // Пустая строка
        headerRow, // Заголовок (8 колонок)
        ...salesData.map((sale: any) => [
          sale.код,                                    // A - code
          sale.наименование,                          // B - Наименование
          '', '', '', '',                            // C,D,E,F - 4 пустые колонки
          sale.цена,                                  // G - ц.пр. (под заголовком "ц.пр.")
          inventoryMap.get(sale.код) || 0            // H - остаток (под заголовком "остаток")
        ])
      ];

      // Создаем рабочую книгу
      const wb = XLSX.utils.book_new();
      
      // Создаем рабочий лист
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      
      // Настраиваем ширину колонок
      const colWidths = [
        { wch: 15 }, // A - code
        { wch: 40 }, // B - Наименование
        { wch: 5 },  // C - пустая
        { wch: 5 },  // D - пустая
        { wch: 5 },  // E - пустая
        { wch: 5 },  // F - пустая
        { wch: 10 }, // G - ц.пр.
        { wch: 10 }  // H - остаток
      ];
      ws['!cols'] = colWidths;

      // Добавляем лист в книгу
      XLSX.utils.book_append_sheet(wb, ws, "Продажи");

      // Генерируем файл
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `продажи_${date}.xlsx`);
      
      alert(`✅ Экспортировано ${salesData.length} продаж в Excel`);
      
    } catch (error) {
      console.error("❌ Export error:", error);
      alert("Ошибка при экспорте");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={exporting}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
    >
      {exporting ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <span>📊</span>
      )}
      <span>Экспорт в Excel</span>
    </button>
  );
}