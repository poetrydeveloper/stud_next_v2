// components/movement-board/Timeline.tsx - ИСПРАВЛЕННЫЙ
import { Product } from '@/components/miller-columns/types'
import TimelineEvent from './TimelineEvent' // ← ДОБАВИТЬ ИМПОРТ

interface TimelineProps {
  product: Product
}

export default function Timeline({ product }: TimelineProps) {
  // Временные данные для демонстрации
  const timelineEvents = [
    { date: '2024-11-14', type: 'SOLD', count: 5, color: 'bg-yellow-300' },
    { date: '2024-11-12', type: 'IN_STORE', count: 10, color: 'bg-green-500' },
    { date: '2024-11-06', type: 'IN_REQUEST', count: 10, color: 'bg-yellow-500' },
    { date: '2024-11-06', type: 'CLEAR', count: 10, color: 'bg-gray-400' }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-gray-800 mb-4">Временная шкала движений</h3>
      
      <div className="space-y-4">
        {timelineEvents.map((event, index) => (
          <TimelineEvent 
            key={index} 
            event={event} 
            isLast={index === timelineEvents.length - 1}
          />
        ))}
      </div>
    </div>
  )
}