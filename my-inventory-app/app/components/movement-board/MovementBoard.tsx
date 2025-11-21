'use client'

import { useEffect, useState } from 'react'
import ProductInfo from './ProductInfo'
import Timeline from './Timeline'
import ActionButtons from './ActionButtons'

/* ============================
      INTERFACES
=============================== */
interface MovementBoardProps {
  product: any
  onClose: () => void
}

interface ProductUnit {
  id: number
  serialNumber: string
  statusCard: StatusKey
  statusProduct: StatusKey
  createdAt: string
  updatedAt: string
  productName: string
  productCode: string
}

type StatusKey =
  | 'CLEAR'
  | 'CANDIDATE'
  | 'SPROUTED'
  | 'IN_REQUEST'
  | 'IN_DELIVERY'
  | 'ARRIVED'
  | 'IN_STORE'
  | 'SOLD'
  | 'CREDIT'
  | 'LOST'

interface StatusStats {
  [key: string]: number
}

/* ============================
      COMPONENT
=============================== */
export default function MovementBoard({ product, onClose }: MovementBoardProps) {
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([])
  const [currentCashDay, setCurrentCashDay] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ============================
        INITIAL LOAD
  =============================== */
  useEffect(() => {
    if (!product?.code) return
    loadProductUnits(product.code)
    loadCurrentCashDay()
  }, [product])

  /* ============================
        LOADERS
  =============================== */
  const loadProductUnits = async (productCode: string) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        `/api/product-units/by-product-code?productCode=${productCode}`
      )

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`)

      const data = await res.json()
      if (!data.ok) {
        setError(data.error || 'Ошибка загрузки данных')
        setProductUnits([])
        return
      }

      setProductUnits(data.data)
    } catch (err) {
      console.error('Ошибка загрузки units:', err)
      setError('Не удалось загрузить Product Units.')
      setProductUnits([])
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentCashDay = async () => {
    try {
      const res = await fetch('/api/cash-days/current')

      if (!res.ok) {
        setCurrentCashDay({ id: 1, isClosed: false, date: new Date() })
        return
      }

      const data = await res.json()
      setCurrentCashDay(
        data.ok
          ? data.data
          : { id: 1, isClosed: false, date: new Date() }
      )
    } catch (err) {
      console.error('Ошибка кассового дня:', err)
      setCurrentCashDay({ id: 1, isClosed: false, date: new Date() })
    }
  }

  /* ============================
        STATS CALCULATION
  =============================== */
  const getStatusStats = (): StatusStats => {
    const stats: StatusStats = {
      CLEAR: 0,
      CANDIDATE: 0,
      SPROUTED: 0,
      IN_REQUEST: 0,
      IN_DELIVERY: 0,
      ARRIVED: 0,
      IN_STORE: 0,
      SOLD: 0,
      CREDIT: 0,
      LOST: 0
    }

    productUnits.forEach(unit => {
      if (stats[unit.statusCard]) stats[unit.statusCard]++
      if (stats[unit.statusProduct]) stats[unit.statusProduct]++
    })

    return stats
  }

  /* ============================
        ACTION HANDLERS
  =============================== */
  const handleCreateUnit = async () => {
    try {
      const res = await fetch('/api/product-units/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productCode: product.code
        })
      })

      const data = await res.json()

      if (!data.ok) {
        setError(`Ошибка создания unit: ${data.error}`)
        return
      }

      await loadProductUnits(product.code)
    } catch (err) {
      console.error('Ошибка создания unit:', err)
      setError('Ошибка создания unit.')
    }
  }

  const handleMakeCandidate = async (unitId: number) => {
    try {
      const res = await fetch('/api/product-units', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId, quantity: 1 })
      })

      const data = await res.json()

      if (!data.ok) {
        setError(`Ошибка добавления в кандидаты: ${data.error}`)
        return
      }

      await loadProductUnits(product.code)
    } catch (err) {
      console.error('Ошибка кандидата:', err)
      setError('Ошибка добавления unit в кандидаты.')
    }
  }

  const handleCreateRequest = async (unitIds: number[]) => {
    try {
      const unitId = unitIds[0]

      const res = await fetch('/api/product-units/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          quantity: 1,
          pricePerUnit: 100
        })
      })

      const data = await res.json()

      if (!data.ok) {
        setError(`Ошибка создания заявки: ${data.error}`)
        return
      }

      await loadProductUnits(product.code)
    } catch (err) {
      console.error('Ошибка заявки:', err)
      setError('Ошибка создания заявки.')
    }
  }

  /* ============================
        UI STATES
  =============================== */
  if (loading) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка движений...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Табло движений</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
        </div>

        <div className="flex-1 p-4 flex items-center justify-center text-center text-red-600">
          <div>
            <div className="text-lg mb-2">❌ Ошибка</div>
            <p>{error}</p>

            <button
              onClick={() => loadProductUnits(product.code)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Повторить
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statusStats = getStatusStats()

  /* ============================
        MAIN RENDER
  =============================== */
  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Табло движений</h2>
          <p className="text-sm text-gray-600">{product?.name}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <ProductInfo product={product} statusCounts={statusStats} />
        <Timeline product={product} productUnits={productUnits} />

        <ActionButtons
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
