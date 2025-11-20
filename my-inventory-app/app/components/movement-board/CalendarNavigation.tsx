// components/movement-board/CalendarNavigation.tsx - КОМПАКТНЫЙ
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
    <div className="flex items-center justify-between mb-2">
      <button
        onClick={() => navigateMonth('prev')}
        disabled={loading}
        className="p-1 hover:bg-gray-100 rounded text-sm disabled:opacity-50"
      >
        ←
      </button>
      
      <div className="text-sm font-semibold text-gray-800 flex items-center gap-1">
        <span>{monthNames[selectedMonth.getMonth()]}</span>
        <span>{selectedMonth.getFullYear()}</span>
        {loading && <span className="text-xs text-gray-500">...</span>}
      </div>
      
      <button
        onClick={() => navigateMonth('next')}
        disabled={loading}
        className="p-1 hover:bg-gray-100 rounded text-sm disabled:opacity-50"
      >
        →
      </button>
    </div>
  )
}