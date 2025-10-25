// /app/inventory/3d-view/components/ContextMenu.tsx

import { ProductUnitCube as ProductUnitType } from '../types/inventory3d'

interface ContextMenuProps {
  position: { x: number; y: number }
  unit: ProductUnitType
  onAction: (action: string, unit: ProductUnitType) => void
  onClose: () => void
}

export const ContextMenu = ({ position, unit, onAction, onClose }: ContextMenuProps) => {
  const actions = [
    { key: 'details', label: 'Показать детали' },
    { key: 'order', label: 'Заказать еще' },
    { key: 'sales-history', label: 'История продаж' },
    { key: 'change-price', label: 'Изменить цену' },
    { key: 'mark-sold', label: 'Пометить проданным' },
  ]

  return (
    <div 
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px 0',
        minWidth: '200px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      {actions.map(action => (
        <div
          key={action.key}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0',
          }}
          onClick={(e) => {
            e.stopPropagation()
            onAction(action.key, unit)
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {action.label}
        </div>
      ))}
    </div>
  )
}