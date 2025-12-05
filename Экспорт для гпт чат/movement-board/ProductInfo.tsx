interface ProductInfoProps {
  product: any
  statusCounts: Record<string, number>
}

export default function ProductInfo({ product, statusCounts }: ProductInfoProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-gray-800 mb-3">Информация о продукте</h3>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600">Код:</span>
          <p className="font-medium">{product.code}</p>
        </div>
        
        <div>
          <span className="text-gray-600">Бренд:</span>
          <p className="font-medium">{product.brand?.name || 'Не указан'}</p>
        </div>
        
        <div className="col-span-2">
          <span className="text-gray-600">Описание:</span>
          <p className="font-medium">{product.description || 'Нет описания'}</p>
        </div>
      </div>

      {/* Статистика по статусам */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Статистика единиц:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            count > 0 && (
              <div key={status} className={`px-3 py-1 rounded-full text-white text-xs font-medium bg-${getStatusColor(status)}`}>
                {getStatusLabel(status)}: {count}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}

// Вспомогательные функции
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    CLEAR: 'gray',
    CANDIDATE: 'purple',
    SPROUTED: 'gray',
    IN_REQUEST: 'yellow',
    IN_DELIVERY: 'yellow',
    ARRIVED: 'green', 
    IN_STORE: 'green',
    SOLD: 'yellow',
    CREDIT: 'red',
    LOST: 'blue'
  }
  return colors[status] || 'gray'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    CLEAR: 'Создан',
    CANDIDATE: 'Кандидат',
    SPROUTED: 'Множ. заявка',
    IN_REQUEST: 'В заявке',
    IN_DELIVERY: 'В доставке',
    ARRIVED: 'Прибыл',
    IN_STORE: 'В магазине',
    SOLD: 'Продан',
    CREDIT: 'Кредит',
    LOST: 'Потерян'
  }
  return labels[status] || status
}