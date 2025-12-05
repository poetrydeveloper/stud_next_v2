// components/movement-board/StatusIcons.tsx
// Утилитарные функции для работы со статусами

export interface StatusConfig {
  icon: string
  label: string
  color: string
  bgColor: string
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  CLEAR: { 
    icon: '○', 
    label: 'Создан', 
    color: 'text-gray-400',
    bgColor: 'bg-gray-100'
  },
  CANDIDATE: { 
    icon: '◐', 
    label: 'Кандидат', 
    color: 'text-purple-500',
    bgColor: 'bg-purple-100'
  },
  SPROUTED: { 
    icon: '●', 
    label: 'Множ. заявка', 
    color: 'text-gray-800',
    bgColor: 'bg-gray-200'
  },
  IN_REQUEST: { 
    icon: '●', 
    label: 'В заявке', 
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100'
  },
  IN_DELIVERY: { 
    icon: '●', 
    label: 'В доставке', 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-200'
  },
  ARRIVED: { 
    icon: '□', 
    label: 'Прибыл', 
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  },
  IN_STORE: { 
    icon: '□', 
    label: 'В магазине', 
    color: 'text-green-600',
    bgColor: 'bg-green-200'
  },
  SOLD: { 
    icon: '◧', 
    label: 'Продан', 
    color: 'text-yellow-300',
    bgColor: 'bg-yellow-50'
  },
  CREDIT: { 
    icon: '◧', 
    label: 'Кредит', 
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  LOST: { 
    icon: '◧', 
    label: 'Потерян', 
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  }
}

export const getStatusConfig = (status: string): StatusConfig => {
  return STATUS_CONFIG[status] || { 
    icon: '○', 
    label: status, 
    color: 'text-gray-400',
    bgColor: 'bg-gray-100'
  }
}

export const getStatusIconConfig = (status: string) => {
  return getStatusConfig(status)
}

// Компонент для отображения иконки статуса
export function StatusIcon({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' | 'lg' }) {
  const config = getStatusConfig(status)
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <span className={`${config.color} ${sizeClasses[size]}`}>
      {config.icon}
    </span>
  )
}

// Компонент для отображения бейджа статуса
export function StatusBadge({ status, showLabel = true }: { status: string; showLabel?: boolean }) {
  const config = getStatusConfig(status)
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bgColor}`}>
      <span className={config.color}>{config.icon}</span>
      {showLabel && <span className="text-gray-700 font-medium">{config.label}</span>}
    </div>
  )
}