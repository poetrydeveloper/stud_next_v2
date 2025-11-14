'use client'

export function VisualizationLegend() {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-white">
      <h4 className="font-semibold mb-2">📊 Легенда визуализации:</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-400 rounded-full mr-2"></div>
          <span>🔴 Меньше min</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
          <span>🟡 Меньше normal</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
          <span>🟢 Норма</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2 border-2 border-black"></div>
          <span>⬤) 1 продажа</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2 border-2 border-black shadow-[0_0_0_2px_white]"></div>
          <span>⬤)) 2 продажи</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2 border-2 border-black shadow-[0_0_0_2px_white,0_0_0_4px_black]"></div>
          <span>⬤))) 3 продажи</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2 relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-300 rounded-full"></div>
          </div>
          <span>Есть в заказе</span>
        </div>
        <div className="flex items-center">
          <span className="text-lg mr-2">📦</span>
          <span>Число = in_store</span>
        </div>
      </div>
    </div>
  )
}