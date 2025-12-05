// components/movement-board/CandidatesTable.tsx - КОМПАКТНЫЙ
'use client'

import { useState } from 'react'

interface CandidatesTableProps {
  product: any
  productUnits: any[]
  onMakeRequest: (unitIds: number[]) => void
}

export default function CandidatesTable({ 
  product, 
  productUnits, 
  onMakeRequest 
}: CandidatesTableProps) {
  const [selectedUnits, setSelectedUnits] = useState<number[]>([])

  const candidateUnits = productUnits.filter(unit => 
    unit.statusCard === 'CANDIDATE' || unit.statusCard === 'CLEAR'
  ).slice(0, 3) // Ограничиваем 3 кандидатами

  const toggleUnitSelection = (unitId: number) => {
    setSelectedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    )
  }

  const handleCreateRequest = () => {
    if (selectedUnits.length > 0) {
      onMakeRequest(selectedUnits)
      setSelectedUnits([])
    }
  }

  if (candidateUnits.length === 0) return null

  return (
    <div className="bg-orange-50 border border-orange-200 rounded p-2">
      <h3 className="font-semibold text-orange-800 text-xs mb-2">
        Кандидаты для заявки ({candidateUnits.length})
      </h3>

      {/* Компактные кнопки */}
      <div className="flex gap-1 mb-2">
        <button
          onClick={() => setSelectedUnits(candidateUnits.map(unit => unit.id))}
          className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
        >
          Выбрать все
        </button>
        
        <button
          onClick={handleCreateRequest}
          disabled={selectedUnits.length === 0}
          className="px-2 py-0.5 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
        >
          Заявка ({selectedUnits.length})
        </button>
      </div>

      {/* Компактный список */}
      <div className="space-y-1 max-h-20 overflow-y-auto">
        {candidateUnits.map(unit => (
          <div key={unit.id} className="flex items-center gap-2 p-1 bg-white rounded border border-orange-100 text-xs">
            <input
              type="checkbox"
              checked={selectedUnits.includes(unit.id)}
              onChange={() => toggleUnitSelection(unit.id)}
              className="w-3 h-3 text-orange-600"
            />
            <span className="flex-1 truncate">ID: {unit.id}</span>
            <span className={`px-1 rounded text-xs ${
              unit.statusCard === 'CANDIDATE' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {unit.statusCard === 'CANDIDATE' ? 'Кандидат' : 'Создан'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}