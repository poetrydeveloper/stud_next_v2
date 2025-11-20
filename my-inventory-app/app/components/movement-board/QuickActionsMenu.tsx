// components/movement-board/QuickActionsMenu.tsx - КОМПАКТНЫЙ
'use client'

interface QuickActionsMenuProps {
  product: any
  productUnits: any[]
  currentCashDay: any
  onCreateUnit: () => void
  onMakeCandidate: (unitId: number) => void
  onCreateRequest: (unitIds: number[]) => void
}

export default function QuickActionsMenu({
  product,
  productUnits,
  currentCashDay,
  onCreateUnit,
  onMakeCandidate,
  onCreateRequest
}: QuickActionsMenuProps) {

  const actions = [
    { 
      id: 'create',
      label: 'Создать', 
      icon: '➕', 
      color: 'bg-blue-500 hover:bg-blue-600',
      handler: onCreateUnit
    },
    { 
      id: 'candidate',
      label: 'В кандидаты', 
      icon: '⭐', 
      color: 'bg-purple-500 hover:bg-purple-600',
      handler: () => {
        const clearUnits = productUnits.filter(unit => unit.statusCard === 'CLEAR')
        if (clearUnits.length > 0) onMakeCandidate(clearUnits[0].id)
      }
    },
    { 
      id: 'order',
      label: 'Заказать', 
      icon: '📋', 
      color: 'bg-yellow-500 hover:bg-yellow-600',
      handler: () => {
        const candidateUnits = productUnits.filter(unit => unit.statusCard === 'CANDIDATE')
        if (candidateUnits.length > 0) onCreateRequest(candidateUnits.map(unit => unit.id))
      }
    },
    { 
      id: 'sell',
      label: 'Продать', 
      icon: '💰', 
      color: 'bg-green-500 hover:bg-green-600',
      handler: () => console.log('Продать')
    }
  ]

  const getActionState = (actionId: string) => {
    const clearUnits = productUnits.filter(unit => unit.statusCard === 'CLEAR')
    const candidateUnits = productUnits.filter(unit => unit.statusCard === 'CANDIDATE')
    
    switch (actionId) {
      case 'candidate': return clearUnits.length === 0 ? 'disabled' : 'enabled'
      case 'order': return candidateUnits.length === 0 ? 'disabled' : 'enabled'
      default: return 'enabled'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded p-2">
      <h3 className="font-semibold text-gray-800 text-xs mb-2">Быстрые действия</h3>
      
      <div className="grid grid-cols-2 gap-1">
        {actions.map((action) => {
          const isDisabled = getActionState(action.id) === 'disabled'
          
          return (
            <button
              key={action.id}
              onClick={action.handler}
              disabled={isDisabled}
              className={`flex items-center gap-1 p-1 rounded text-white text-xs font-medium transition-colors ${action.color} 
                         ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              <span className="text-xs">{action.icon}</span>
              <span className="truncate">{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* Компактная информация о кассовом дне */}
      {currentCashDay && (
        <div className="mt-1 p-1 bg-gray-100 rounded text-xs text-gray-600 text-center">
          Касса: {new Date(currentCashDay.date).toLocaleDateString('ru-RU')}
          {currentCashDay.isClosed && ' (закр.)'}
        </div>
      )}
    </div>
  )
}