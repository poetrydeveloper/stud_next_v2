// app/store/DisassemblyButtons.tsx (ОБНОВЛЕННАЯ - КОМПАКТНАЯ ВЕРСИЯ)
"use client";

import { useState, useEffect } from "react";

interface ProductUnit {
  id: number;
  statusProduct: string;
  disassemblyStatus: string;
  isParsingAlgorithm: boolean;
  productName?: string;
  serialNumber: string;
}

interface DisassemblyButtonsProps {
  unit: ProductUnit;
  onOperationSuccess: () => void;
}

interface Scenario {
  id: number;
  name: string;
  isActive: boolean;
}

export default function DisassemblyButtons({ unit, onOperationSuccess }: DisassemblyButtonsProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasScenario, setHasScenario] = useState(false);

  // Проверяем сценарии при загрузке
  useEffect(() => {
    if (unit.statusProduct === "IN_STORE" && unit.disassemblyStatus === "MONOLITH") {
      checkUnitScenarios();
    }
  }, [unit]);

  // Проверяем существующие сценарии для unit
  const checkUnitScenarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/disassembly/unit/${unit.id}/scenarios`);
      const data = await response.json();
      
      if (data.ok) {
        setScenarios(data.data || []);
        setHasScenario(data.data.length > 0);
      }
    } catch (error) {
      console.error("Ошибка загрузки сценариев:", error);
    } finally {
      setLoading(false);
    }
  };

  // Выполнение разборки
  const handleDisassemble = async () => {
    if (!scenarios.length) return;
    
    const scenario = scenarios[0];
    
    if (!confirm(`Выполнить разборку по сценарию "${scenario.name}"?`)) {
      return;
    }

    try {
      const response = await fetch("/api/disassembly/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id })
      });

      const data = await response.json();
      
      if (data.ok) {
        alert("✅ Разборка выполнена успешно!");
        onOperationSuccess();
      } else {
        alert("❌ Ошибка разборки: " + data.error);
      }
    } catch (error: any) {
      alert("❌ Ошибка сети: " + error.message);
    }
  };

  // Переход на страницу создания сценария
  const handleCreateScenario = () => {
    localStorage.setItem('storeScrollPosition', window.scrollY.toString());
    localStorage.setItem('selectedUnitId', unit.id.toString());
    window.location.href = `/disassembly/scenario/create?unitId=${unit.id}`;
  };

  // Просмотр сценария
  const handleViewScenario = () => {
    if (scenarios.length > 0) {
      window.open(`/disassembly/scenario/${scenarios[0].id}`, '_blank');
    }
  };

  // Условия для показа кнопок
  const canShowButtons = unit.statusProduct === "IN_STORE" && unit.disassemblyStatus === "MONOLITH";
  const canDisassemble = hasScenario && scenarios.some(s => s.isActive);
  const canCreateScenario = !hasScenario;

  if (!canShowButtons) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-1">
        <div className="text-xs text-gray-500">...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1 border-t border-gray-200 pt-2 mt-2">
      {/* Кнопка разборки - компактная */}
      {canDisassemble && (
        <button 
          onClick={handleDisassemble}
          className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors flex items-center space-x-1 justify-center"
          title="Выполнить разборку"
        >
          <span className="text-xs">🔧</span>
          <span>Разобрать</span>
        </button>
      )}

      {/* Кнопка создания/просмотра сценария - компактная */}
      {canCreateScenario ? (
        <button 
          onClick={handleCreateScenario}
          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center space-x-1 justify-center"
          title="Создать сценарий"
        >
          <span className="text-xs">📋</span>
          <span>Создать сценарий</span>
        </button>
      ) : (
        <button 
          onClick={handleViewScenario}
          className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors flex items-center space-x-1 justify-center"
          title="Просмотреть сценарий"
        >
          <span className="text-xs">👁️</span>
          <span>Сценарий</span>
        </button>
      )}
    </div>
  );
}