// components/movement-board/CalendarNavigation.tsx
'use client'

interface CalendarNavigationProps {
  selectedMonth: Date
  onMonthChange: (date: Date) => void
  loading: boolean
}

export default function CalendarNavigation({ 
  selectedMonth, 
  onMonthChange, 
  loading
}: CalendarNavigationProps) {
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth)
    newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1))
    onMonthChange(newDate)
  }

  const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

  return (
    <div className="flex items-center justify-between mb-2 px-1">
      <button
        onClick={() => navigateMonth('prev')}
        disabled={loading}
        className="p-1 hover:bg-gray-100 rounded text-xs disabled:opacity-50"
        title="Предыдущий месяц"
      >
        ←
      </button>
      
      <div className="text-xs font-semibold text-gray-800">
        <span>{monthNames[selectedMonth.getMonth()]}</span>
        <span> {selectedMonth.getFullYear()}</span>
      </div>
      
      <button
        onClick={() => navigateMonth('next')}
        disabled={loading}
        className="p-1 hover:bg-gray-100 rounded text-xs disabled:opacity-50"
        title="Следующий месяц"
      >
        →
      </button>
    </div>
  )
}