// app/product-units/candidates/page.tsx
"use client";

import { useEffect, useState } from "react";
import CandidateUnitsGrid from "@/app/components/CandidateUnitsGrid";
import { CandidateUnit } from "@/types/product-unit";

export default function CandidatesPage() {
  const [units, setUnits] = useState<CandidateUnit[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Функция загрузки кандидатов
  const loadCandidateUnits = async () => {
    setLoading(true);
    try {
      console.log("🔄 Загружаем кандидатов...");
      const response = await fetch("/api/product-units?status=CANDIDATE");
      const data = await response.json();
      
      if (data.ok) {
        console.log("✅ Кандидаты загружены:", data.data?.length || 0);
        setUnits(data.data || []);
      } else {
        console.error("❌ Ошибка загрузки кандидатов:", data.error);
        setUnits([]);
      }
    } catch (error) {
      console.error("💥 Ошибка сети:", error);
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Загружаем данные при монтировании
  useEffect(() => {
    loadCandidateUnits();
  }, []);

  // ✅ Функция обновления данных после создания заявки
  const handleRequestCreated = () => {
    console.log("🔄 Обновляем список кандидатов после создания заявки...");
    loadCandidateUnits(); // Перезагружаем данные
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Кандидаты на заявку</h1>
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Загрузка кандидатов...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Кандидаты на заявку</h1>
      
      {units.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-gray-500 text-lg mb-2">📭 Кандидатов нет</div>
          <div className="text-gray-400 text-sm">
            Переведите CLEAR units в кандидаты для создания заявок
          </div>
        </div>
      ) : (
        <CandidateUnitsGrid 
          units={units}
          onRequestCreated={handleRequestCreated}
        />
      )}

      {/* ✅ Отладочная информация */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <div className="text-sm text-gray-600">
          <strong>Отладка:</strong> Найдено {units.length} кандидатов
        </div>
        {units.length > 0 && (
          <div className="text-xs text-gray-500 mt-2">
            Первый кандидат: {units[0].productName} (ID: {units[0].id})
          </div>
        )}
      </div>
    </div>
  );
}