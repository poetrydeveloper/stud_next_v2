// /app/inventory/3d-view/hooks/useInventory3D.ts

import { useState, useEffect } from 'react'
import { CategoryCube, SpineCube, ProductUnitCube, RequestLine, SalesPlane } from '../types/inventory3d'
import { transformTo3DStructure } from './transformers/dataTransformer'

export const useInventory3D = () => {
  const [data, setData] = useState<{
    categories: CategoryCube[]
    spines: SpineCube[]
    productUnits: ProductUnitCube[]
    requestLines: RequestLine[]
    salesPlane: SalesPlane
  } | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadInventoryData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Загрузка данных из API
        const prismaData = await fetchInventoryData()
        
        // Преобразование в 3D структуру
        const threeDData = transformTo3DStructure(prismaData)
        setData(threeDData)
        
      } catch (err) {
        console.error('Error loading 3D inventory:', err)
        setError('Не удалось загрузить данные инвентаря')
        
        // Загрузка тестовых данных при ошибке
        const mockData = await getMockInventoryData()
        setData(mockData)
      } finally {
        setLoading(false)
      }
    }

    loadInventoryData()
  }, [])

  return {
    categories: data?.categories || [],
    spines: data?.spines || [],
    productUnits: data?.productUnits || [],
    requestLines: data?.requestLines || [],
    salesPlane: data?.salesPlane || { 
      position: { x: 0, y: -5, z: 0 }, 
      size: { x: 20, y: 0.1, z: 20 }, 
      soldUnits: [] 
    },
    loading,
    error
  }
}

// Функция загрузки данных с API
const fetchInventoryData = async () => {
  try {
    const response = await fetch('/api/inventory/3d-view')
    if (!response.ok) throw new Error('API response not ok')
    return await response.json()
  } catch (error) {
    console.warn('API недоступен, используем тестовые данные')
    return getMockPrismaData()
  }
}

// Тестовые данные для Prisma
const getMockPrismaData = () => ({
  categories: [
    {
      id: 1,
      name: 'Ручной инструмент',
      children: [
        {
          id: 2,
          name: 'Ключи',
          children: [
            {
              id: 3,
              name: 'Комбинированные',
              spines: [
                { id: 1, name: 'Ключ комбинированный 10мм', slug: 'combi-key-10mm', categoryId: 3 },
                { id: 2, name: 'Ключ комбинированный 12мм', slug: 'combi-key-12mm', categoryId: 3 }
              ]
            }
          ]
        }
      ]
    }
  ],
  allUnits: [
    {
      id: 1,
      serialNumber: 'FORS-001',
      productId: 1,
      disassemblyStatus: 'MONOLITH',
      cardStatus: 'ARRIVED',
      physicalStatus: 'IN_STORE',
      product: {
        name: 'Ключ 10мм Форсаж',
        brand: 'Форсаж',
        price: 150,
        spineId: 1
      }
    }
  ],
  activeRequests: []
})

// Резервные тестовые данные
const getMockInventoryData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    categories: [
      {
        id: 1,
        name: 'Ручной инструмент',
        path: 'Ручной инструмент',
        position: { x: 0, y: 0, z: 0 },
        size: { x: 12, y: 8, z: 12 },
        color: 'hsl(0, 70%, 20%)',
        spines: []
      }
    ],
    spines: [
      {
        id: 1,
        name: 'Ключ комбинированный 10мм',
        slug: 'combi-key-10mm',
        categoryId: 1,
        position: { x: -2, y: 0, z: 0 },
        size: { x: 1.8, y: 1.8, z: 1.8 },
        color: 'hsl(0, 50%, 60%)',
        productUnits: []
      }
    ],
    productUnits: [
      {
        id: 1,
        serialNumber: 'FORS-001',
        productId: 1,
        productName: 'Ключ 10мм Форсаж',
        brandName: 'Форсаж',
        price: 150,
        disassemblyStatus: 'MONOLITH',
        cardStatus: 'ARRIVED',
        physicalStatus: 'IN_STORE',
        position: { x: -2.5, y: 0.3, z: 0 },
        size: { x: 0.5, y: 0.5, z: 0.5 },
        color: '#666666',
        pulse: false,
        quantity: 1,
        spineId: 1
      }
    ],
    requestLines: [],
    salesPlane: {
      position: { x: 0, y: -8, z: 0 },
      size: { x: 25, y: 0.1, z: 15 },
      soldUnits: []
    }
  }
}