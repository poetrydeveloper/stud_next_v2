// components/movement-board/ProductMovementDashboard.tsx - КОМПАКТНАЯ ВЕРСИЯ БЕЗ ХУКОВ
'use client'

import { useEffect, useState } from 'react'
import CurrentUnitsSnapshot from './CurrentUnitsSnapshot'
import CalendarTimeline from './CalendarTimeline'
import QuickActionsMenu from './QuickActionsMenu'
import StockManagement from './StockManagement'
import CandidatesTable from './CandidatesTable'

interface ProductMovementDashboardProps {
  product: any
  onClose: () => void
}

interface ProductUnit {
  id: number
  serialNumber: string
  statusCard: string
  statusProduct: string
  createdAt: string
  updatedAt: string
  productName: string
  productCode: string
}

export default function ProductMovementDashboard({ product, onClose }: ProductMovementDashboardProps) {
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [currentCashDay, setCurrentCashDay] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  // ЗАГРУЗКА ДАННЫХ
  useEffect(() => {
    if (product?.code) {
      loadProductUnits()
      loadCurrentCashDay()
    }
  }, [product])

  const loadProductUnits = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/product-units/by-product-code?productCode=${product.code}`)
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      
      const data = await response.json()
      if (data.ok) {
        setProductUnits(data.data)
      } else {
        setError(data.error || 'Ошибка загрузки')
      }
    } catch (error) {
      setError('Не удалось загрузить данные')
      setProductUnits([])
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentCashDay = async () => {
    try {
      const response = await fetch('/api/cash-days/current')
      if (response.ok) {
        const data = await response.json()
        if (data.ok) {
          setCurrentCashDay(data.data)
          return
        }
      }
      setCurrentCashDay({ id: 1, isClosed: false, date: new Date() })
    } catch (error) {
      setCurrentCashDay({ id: 1, isClosed: false, date: new Date() })
    }
  }

  // ОБРАБОТЧИКИ ДЕЙСТВИЙ
  const handleCreateUnit = async () => {
    try {
      const response = await fetch('/api/product-units/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, productCode: product.code })
      })
      const data = await response.json()
      if (data.ok) await loadProductUnits()
      else setError(`Ошибка: ${data.error}`)
    } catch (error) {
      setError('Ошибка создания unit')
    }
  }

  const handleMakeCandidate = async (unitId: number) => {
    try {
      const response = await fetch('/api/product-units', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId, quantity: 1 })
      })
      const data = await response.json()
      if (data.ok) await loadProductUnits()
      else setError(`Ошибка: ${data.error}`)
    } catch (error) {
      setError('Ошибка добавления в кандидаты')
    }
  }

  const handleCreateRequest = async (unitIds: number[]) => {
    try {
      const response = await fetch('/api/product-units/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId: unitIds[0], quantity: 1, pricePerUnit: 100 })
      })
      const data = await response.json()
      if (data.ok) await loadProductUnits()
      else setError(`Ошибка: ${data.error}`)
    } catch (error) {
      setError('Ошибка создания заявки')
    }
  }

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  const getStatusStats = () => {
    const stats = { CLEAR: 0, CANDIDATE: 0, SPROUTED: 0, IN_REQUEST: 0, IN_DELIVERY: 0, ARRIVED: 0, IN_STORE: 0, SOLD: 0, CREDIT: 0, LOST: 0 }
    productUnits.forEach(unit => {
      if (unit.statusCard && stats.hasOwnProperty(unit.statusCard)) stats[unit.statusCard as keyof typeof stats]++
      if (unit.statusProduct && stats.hasOwnProperty(unit.statusProduct)) stats[unit.statusProduct as keyof typeof stats]++
    })
    return stats
  }

  const calculateStockInfo = () => {
    const statusStats = getStatusStats()
    const inStoreCount = statusStats.IN_STORE || 0
    const inRequestCount = statusStats.IN_REQUEST || 0
    const totalCount = inStoreCount + inRequestCount
    const stockNorm = 15
    return {
      stockNorm,
      totalCount,
      needToOrder: Math.max(0, stockNorm - totalCount),
      hasCandidates: statusStats.CANDIDATE > 0,
      inStoreCount,
      inRequestCount
    }
  }

  // КОМПАКТНЫЙ ЗАГРУЗЧИК
  if (loading) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex items-center justify-center p-2">
        <div className="text-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-1 text-xs text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  // КОМПАКТНАЯ ОШИБКА
  if (error) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex flex-col p-2">
        <CompactHeader product={product} onClose={onClose} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-600">
            <div className="text-sm mb-1">❌ Ошибка</div>
            <p className="text-xs mb-2">{error}</p>
            <button 
              onClick={loadProductUnits}
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Повторить
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statusStats = getStatusStats()
  const stockInfo = calculateStockInfo()

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      <CompactHeader product={product} onClose={onClose} />
      
      {/* ОСНОВНОЙ КОНТЕНТ С КОМПАКТНЫМИ ОТСТУПАМИ */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <CurrentUnitsSnapshot product={product} statusCounts={statusStats} />
        <StockManagement stockInfo={stockInfo} />
        <CalendarTimeline 
          product={product}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
        
        {stockInfo.needToOrder > 0 && stockInfo.hasCandidates && (
          <CandidatesTable 
            product={product}
            productUnits={productUnits}
            onMakeRequest={handleCreateRequest}
          />
        )}

        <QuickActionsMenu 
          product={product}
          productUnits={productUnits}
          currentCashDay={currentCashDay}
          onCreateUnit={handleCreateUnit}
          onMakeCandidate={handleMakeCandidate}
          onCreateRequest={handleCreateRequest}
        />
      </div>
    </div>
  )
}

// КОМПАКТНЫЙ ХЕДЕР
function CompactHeader({ product, onClose }: { product: any; onClose: () => void }) {
  return (
    <div className="p-2 border-b border-gray-200 flex-shrink-0 bg-white">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-gray-800 truncate">Движения</h2>
          <p className="text-xs text-gray-600 truncate">{product?.name}</p>
        </div>
        <button 
          onClick={onClose} 
          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded text-sm"
          title="Закрыть"
        >
          ✕
        </button>
      </div>
    </div>
  )
}