// components/movement-board/TimelineEvent.tsx
interface TimelineEventProps {
  event: {
    date: string
    type: string
    count: number
    color: string
  }
  isLast: boolean
}

export default function TimelineEvent({ event, isLast }: TimelineEventProps) {
  const getEventLabel = (type: string) => {
    const labels: Record<string, string> = {
      CLEAR: 'Созданы единицы',
      CANDIDATE: 'Стали кандидатами',
      IN_REQUEST: 'Отправлены в заявку',
      IN_STORE: 'Поставлены в магазин',
      SOLD: 'Проданы'
    }
    return labels[type] || type
  }

  return (
    <div className="flex items-start gap-3">
      {/* Точка события */}
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full ${event.color} border-2 border-white shadow-sm`} />
        {!isLast && <div className="w-0.5 h-8 bg-gray-300 mt-1" />}
      </div>

      {/* Информация события */}
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-800">
            {getEventLabel(event.type)}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString('ru-RU')}
          </span>
        </div>
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-white mt-1 ${event.color}`}>
          <div className="w-2 h-2 rounded-full bg-white" />
          {event.count} ед.
        </div>
      </div>
    </div>
  )
}