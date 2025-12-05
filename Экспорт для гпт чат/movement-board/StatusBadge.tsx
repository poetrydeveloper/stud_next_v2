// components/movement-board/StatusBadge.tsx
interface StatusBadgeProps {
  status: string
  count: number
}

export default function StatusBadge({ status, count }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      CLEAR: { color: 'bg-gray-400', label: 'Создан' },
      CANDIDATE: { color: 'bg-purple-500', label: 'Кандидат' },
      SPROUTED: { color: 'bg-black', label: 'Множ. заявка' },
      IN_REQUEST: { color: 'bg-yellow-500', label: 'В заявке' },
      IN_DELIVERY: { color: 'bg-blue-400', label: 'Доставка' },
      ARRIVED: { color: 'bg-green-400', label: 'Поставлен' },
      IN_STORE: { color: 'bg-green-500', label: 'В магазине' },
      SOLD: { color: 'bg-yellow-300', label: 'Продан' },
      CREDIT: { color: 'bg-red-500', label: 'В кредите' },
      LOST: { color: 'bg-blue-500', label: 'Потерян' }
    }
    return config[status] || { color: 'bg-gray-300', label: status }
  }

  const { color, label } = getStatusConfig(status)

  return (
    <div className={`px-3 py-1 rounded-full text-white text-xs font-medium ${color}`}>
      {label}: {count}
    </div>
  )
}