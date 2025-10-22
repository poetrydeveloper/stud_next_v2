'use client';

import { useState } from 'react';

interface DisassemblyExecuteButtonProps {
  scenarioId: number;
  scenarioName: string;
  unitId: number; // ← ДОБАВЛЕНО
  onExecuted?: () => void;
}

export default function DisassemblyExecuteButton({
  scenarioId,
  scenarioName,
  unitId, // ← ДОБАВЛЕНО
  onExecuted
}: DisassemblyExecuteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExecute = async () => {
    if (!confirm(`Выполнить разборку по сценарию "${scenarioName}"?`)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/disassembly/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          scenarioId, 
          unitId // ← ДОБАВЛЕНО
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error);
      }

      setError('');
      
      if (onExecuted) {
        onExecuted();
      }

      alert('Разборка успешно выполнена!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleExecute}
        disabled={isLoading}
        className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Выполнение...' : 'Выполнить разборку'}
      </button>
      
      {error && (
        <div className="text-red-600 text-xs mt-1">
          {error}
        </div>
      )}
    </div>
  );
}