// components/movement-board/ActionButtons.tsx
import { Product } from '@/app/components/miller-columns/types'

interface ActionButtonsProps {
  product: Product
}

export default function ActionButtons({ product }: ActionButtonsProps) {
  const actions = [
    { label: 'Создать Unit', icon: '➕', color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'В кандидаты', icon: '⭐', color: 'bg-purple-500 hover:bg-purple-600' },
    { label: 'Создать заявку', icon: '📋', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { label: 'Поставить в магазин', icon: '🏪', color: 'bg-green-500 hover:bg-green-600' },
    { label: 'Продать', icon: '💰', color: 'bg-yellow-300 hover:bg-yellow-400' }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Действия</h3>
      
      <div className="grid grid-cols-1 gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium 
                       transition-colors ${action.color} active:scale-95`}
          >
            <span className="text-lg">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}