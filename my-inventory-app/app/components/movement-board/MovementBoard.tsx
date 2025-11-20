'use client'

import { useEffect, useState } from 'react'
import ProductInfo from './ProductInfo'
import Timeline from './Timeline'
import ActionButtons from './ActionButtons'

interface MovementBoardProps {
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

export default function MovementBoard({ product, onClose }: MovementBoardProps) {
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [currentCashDay, setCurrentCashDay] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // 1. ЗАГРУЗКА PRODUCT UNITS
  useEffect(() => {
    if (product?.code) {
      loadProductUnits(product.code)
      loadCurrentCashDay()
    }
  }, [product])

  const loadProductUnits = async (productCode: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Загрузка units для продукта:', productCode)
      const response = await fetch(`/api/product-units/by-product-code?productCode=${productCode}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.ok) {
        console.log('✅ Units загружены:', data.data.length, 'шт.')
        setProductUnits(data.data)
      } else {
        console.error('❌ Ошибка в ответе API:', data.error)
        setError(data.error || 'Ошибка загрузки данных')
      }
    } catch (error) {
      console.error('💥 Ошибка загрузки Product Units:', error)
      setError('Не удалось загрузить данные. Проверьте консоль для деталей.')
      // Устанавливаем пустой массив чтобы избежать ошибок рендеринга
      setProductUnits([])
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentCashDay = async () => {
    try {
      console.log('🔄 Загрузка кассового дня...')
      const response = await fetch('/api/cash-days/current')
      
      if (!response.ok) {
        // Если endpoint не работает, используем заглушку
        console.warn('⚠️ Кассовый день недоступен, используем заглушку')
        setCurrentCashDay({ id: 1, isClosed: false, date: new Date() })
        return
      }
      
      const data = await response.json()
      
      if (data.ok) {
        console.log('✅ Кассовый день загружен')
        setCurrentCashDay(data.data)
      } else {
        console.warn('⚠️ Ошибка кассового дня, используем заглушку')
        setCurrentCashDay({ id: 1, isClosed: false, date: new Date() })
      }
    } catch (error) {
      console.error('💥 Ошибка загрузки кассового дня:', error)
      // Используем заглушку при ошибке
      setCurrentCashDay({ id: 1, isClosed: false, date: new Date() })
    }
  }

  // 2. СТАТИСТИКА ПО СТАТУСАМ
  const getStatusStats = () => {
    const stats = {
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
      if (unit.statusCard && stats.hasOwnProperty(unit.statusCard)) {
        stats[unit.statusCard as keyof typeof stats]++
      }
      if (unit.statusProduct && stats.hasOwnProperty(unit.statusProduct)) {
        stats[unit.statusProduct as keyof typeof stats]++
      }
    })

    return stats
  }

  // 3. ОБРАБОТЧИКИ ДЕЙСТВИЙ
  const handleCreateUnit = async () => {
    try {
      console.log('🔄 Создание unit для продукта:', product.code)
      const response = await fetch('/api/product-units/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productCode: product.code
        })
      })
      
      const data = await response.json()
      
      if (data.ok) {
        console.log('✅ Unit создан:', data.data)
        await loadProductUnits(product.code) // Перезагружаем данные
      } else {
        console.error('❌ Ошибка создания unit:', data.error)
        setError(`Ошибка создания unit: ${data.error}`)
      }
    } catch (error) {
      console.error('💥 Ошибка создания unit:', error)
      setError('Ошибка создания unit. Проверьте консоль.')
    }
  }

  const handleMakeCandidate = async (unitId: number) => {
    try {
      console.log('🔄 Добавление unit в кандидаты:', unitId)
      const response = await fetch('/api/product-units', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId, quantity: 1 })
      })
      
      const data = await response.json()
      
      if (data.ok) {
        console.log('✅ Unit добавлен в кандидаты')
        await loadProductUnits(product.code)
      } else {
        console.error('❌ Ошибка добавления в кандидаты:', data.error)
        setError(`Ошибка добавления в кандидаты: ${data.error}`)
      }
    } catch (error) {
      console.error('💥 Ошибка добавления в кандидаты:', error)
      setError('Ошибка добавления в кандидаты. Проверьте консоль.')
    }
  }

  const handleCreateRequest = async (unitIds: number[]) => {
    try {
      const unitId = unitIds[0]
      console.log('🔄 Создание заявки для unit:', unitId)
      
      const response = await fetch('/api/product-units/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          quantity: 1,
          pricePerUnit: 100
        })
      })
      
      const data = await response.json()
      
      if (data.ok) {
        console.log('✅ Заявка создана')
        await loadProductUnits(product.code)
      } else {
        console.error('❌ Ошибка создания заявки:', data.error)
        setError(`Ошибка создания заявки: ${data.error}`)
      }
    } catch (error) {
      console.error('💥 Ошибка создания заявки:', error)
      setError('Ошибка создания заявки. Проверьте консоль.')
    }
  }

  // Состояние загрузки
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

  // Состояние ошибки
  if (error) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Табло движений</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
          </div>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center text-red-600">
            <div className="text-lg mb-2">❌ Ошибка</div>
            <p>{error}</p>
            <button 
              onClick={() => loadProductUnits(product.code)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statusStats = getStatusStats()

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Табло движений</h2>
            <p className="text-sm text-gray-600">{product?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {/* Информация о продукте */}
        <ProductInfo product={product} statusCounts={statusStats} />

        {/* Временная шкала */}
        <Timeline product={product} productUnits={productUnits} />

        {/* Кнопки действий */}
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