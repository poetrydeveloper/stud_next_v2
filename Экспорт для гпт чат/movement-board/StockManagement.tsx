// components/movement-board/StockManagement.tsx - КОМПАКТНЫЙ
interface StockManagementProps {
  stockInfo: {
    stockNorm: number
    totalCount: number
    needToOrder: number
    hasCandidates: boolean
    inStoreCount: number
    inRequestCount: number
  }
}

export default function StockManagement({ stockInfo }: StockManagementProps) {
  const { stockNorm, totalCount, needToOrder, hasCandidates, inStoreCount, inRequestCount } = stockInfo
  
  return (
    <div className="bg-white border border-gray-200 rounded p-2">
      <h3 className="font-semibold text-gray-800 text-xs mb-2">Учет остатков</h3>
      
      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
        {/* Норма остатков */}
        <div className="text-center p-1 bg-blue-50 rounded">
          <div className="text-blue-600 font-medium">Норма</div>
          <div className="text-sm font-bold text-blue-700">{stockNorm}</div>
        </div>
        
        {/* Общее количество */}
        <div className="text-center p-1 bg-green-50 rounded">
          <div className="text-green-600 font-medium">Всего</div>
          <div className="text-sm font-bold text-green-700">{totalCount}</div>
        </div>
      </div>
      
      {/* Требуется заказать */}
      <div className={`p-1 rounded text-center text-xs ${
        needToOrder > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
      }`}>
        {needToOrder > 0 ? `Заказать: ${needToOrder} шт.` : 'Запас достаточный'}
        {needToOrder > 0 && (
          <div className="text-xs mt-0.5">
            {hasCandidates ? 'Есть кандидаты' : 'Нет кандидатов'}
          </div>
        )}
      </div>
    </div>
  )
}