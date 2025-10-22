// app/components/CandidateUnitsGrid.tsx
"use client";

import { CandidateUnit } from "@/types/product-unit";
import CandidateUnitCard from "./CandidateUnitCard";
import { SpineCardService } from "@/app/lib/spineCardService";

interface CandidateUnitsGridProps {
  units: CandidateUnit[];
  onRequestCreated?: () => void;
}

export default function CandidateUnitsGrid({ units, onRequestCreated }: CandidateUnitsGridProps) {
  console.log("🔍 [GRID] Компонент рендерится, units:", units?.length);

  if (!units || units.length === 0) return null;

  // ✅ Функция обработки создания заявки - С УСИЛЕННЫМ ЛОГИРОВАНИЕМ
  const handleAddToRequest = async (unitId: number, quantity: number, pricePerUnit: number) => {
    console.log("🎯 [GRID] === НАЧАЛО ОБРАБОТКИ ЗАЯВКИ ===");
    console.log("🎯 [GRID] Получены данные:", { 
      unitId, 
      quantity, 
      pricePerUnit,
      typeOfPrice: typeof pricePerUnit,
      isNaN: isNaN(pricePerUnit),
      isFinite: isFinite(pricePerUnit)
    });
    
    // ✅ ПРОВЕРКА ЦЕНЫ - ДЕТАЛЬНАЯ
    if (pricePerUnit === undefined) {
      console.error("❌ [GRID] Цена = undefined!");
      SpineCardService.showNotification("❌ Ошибка: цена не передана (undefined)", true);
      return;
    }

    if (pricePerUnit === null) {
      console.error("❌ [GRID] Цена = null!");
      SpineCardService.showNotification("❌ Ошибка: цена не передана (null)", true);
      return;
    }

    if (isNaN(pricePerUnit)) {
      console.error("❌ [GRID] Цена = NaN!");
      SpineCardService.showNotification("❌ Ошибка: цена не число (NaN)", true);
      return;
    }

    if (!isFinite(pricePerUnit)) {
      console.error("❌ [GRID] Цена не конечное число:", pricePerUnit);
      SpineCardService.showNotification("❌ Ошибка: цена не конечное число", true);
      return;
    }

    if (pricePerUnit <= 0) {
      console.error("❌ [GRID] Цена <= 0:", pricePerUnit);
      SpineCardService.showNotification("❌ Укажите цену за единицу товара", true);
      return;
    }

    if (quantity < 1) {
      console.error("❌ [GRID] Количество не указано:", quantity);
      SpineCardService.showNotification("❌ Укажите количество товара", true);
      return;
    }
    
    console.log("✅ [GRID] Все проверки пройдены, вызываем SpineCardService...");
    
    try {
      console.log("🔄 [GRID] Вызываем SpineCardService.createRequest...");
      const result = await SpineCardService.createRequest(unitId, quantity, pricePerUnit);
      
      console.log("📦 [GRID] Результат от SpineCardService:", result);
      
      if (result.success) {
        console.log("✅ [GRID] Заявка создана успешно!");
        SpineCardService.showNotification(
          quantity === 1 
            ? "✅ Одиночная заявка создана" 
            : `✅ Заявка на ${quantity} единиц создана`
        );
        
        if (onRequestCreated) {
          console.log("🔄 [GRID] Вызываем onRequestCreated callback...");
          onRequestCreated();
        }
      } else {
        console.error("❌ [GRID] Ошибка создания заявки:", result.error);
        SpineCardService.showNotification(`❌ Ошибка: ${result.error}`, true);
      }
    } catch (error: any) {
      console.error("💥 [GRID] Критическая ошибка:", error);
      SpineCardService.showNotification("💥 Ошибка при создании заявки", true);
    }
    
    console.log("🎯 [GRID] === КОНЕЦ ОБРАБОТКИ ЗАЯВКИ ===");
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Кандидаты</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <CandidateUnitCard 
            key={unit.id} 
            unit={unit}
            onAddToRequest={handleAddToRequest}
          />
        ))}
      </div>
    </div>
  );
}