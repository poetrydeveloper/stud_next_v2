// /app/api/inventory/3d-view/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const inventoryData = await getInventoryData()
    return NextResponse.json(inventoryData)
  } catch (error) {
    console.error('Error in 3D inventory API:', error)
    
    // Возвращаем тестовые данные при ошибке
    return NextResponse.json(getMockData())
  }
}

async function getInventoryData() {
  try {
    // Получаем все категории (только корневые)
    const categories = await prisma.category.findMany({
      include: {
        spines: {
          include: {
            products: {
              include: {
                // Включаем связанные данные продукта если нужно
                category: true,
                brand: true
              }
            }
          }
        }
      },
      where: {
        parent_id: null
      }
    })

    // Получаем все units отдельным запросом
    const allUnits = await prisma.productUnit.findMany({
      include: {
        product: {
          include: {
            spine: {
              include: {
                category: true
              }
            },
            category: true,
            brand: true
          }
        },
        requests: true,
        disassemblyParent: true,
        disassemblyChildren: true
      }
    })

    // Получаем активные заявки
    const activeRequests = await prisma.request.findMany({
      where: {
        status: {
          in: ['PENDING', 'PROCESSING', 'SHIPPED']
        }
      },
      include: {
        units: {
          include: {
            product: {
              include: {
                spine: true
              }
            }
          }
        }
      }
    })

    return {
      categories,
      allUnits,
      activeRequests
    }
  } catch (error) {
    console.error('Database error:', error)
    return getMockData()
  }
}

// Тестовые данные для разработки
function getMockData() {
  return {
    categories: [
      {
        id: 1,
        name: 'Ручной инструмент',
        parent_id: null,
        spines: [
          {
            id: 1,
            name: 'Ключ комбинированный 10мм',
            slug: 'combi-key-10mm',
            categoryId: 1,
            products: [
              {
                id: 1,
                name: 'Ключ 10мм Форсаж',
                brand: 'Форсаж',
                price: 150,
                spineId: 1,
                category: { id: 1, name: 'Ручной инструмент' },
                brand: { id: 1, name: 'Форсаж' }
              },
              {
                id: 2,
                name: 'Ключ 10мм Форс',
                brand: 'Форс',
                price: 120,
                spineId: 1,
                category: { id: 1, name: 'Ручной инструмент' },
                brand: { id: 2, name: 'Форс' }
              }
            ]
          },
          {
            id: 2,
            name: 'Ключ комбинированный 12мм',
            slug: 'combi-key-12mm',
            categoryId: 1,
            products: [
              {
                id: 3,
                name: 'Ключ 12мм Форсаж',
                brand: 'Форсаж',
                price: 170,
                spineId: 2,
                category: { id: 1, name: 'Ручной инструмент' },
                brand: { id: 1, name: 'Форсаж' }
              }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Электроинструмент',
        parent_id: null,
        spines: [
          {
            id: 3,
            name: 'Дрель электрическая',
            slug: 'electric-drill',
            categoryId: 2,
            products: [
              {
                id: 4,
                name: 'Дрель Pro',
                brand: 'Bosch',
                price: 250,
                spineId: 3,
                category: { id: 2, name: 'Электроинструмент' },
                brand: { id: 3, name: 'Bosch' }
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
          id: 1,
          name: 'Ключ 10мм Форсаж',
          brand: 'Форсаж',
          price: 150,
          spineId: 1,
          spine: {
            id: 1,
            name: 'Ключ комбинированный 10мм',
            slug: 'combi-key-10mm',
            categoryId: 1,
            category: {
              id: 1,
              name: 'Ручной инструмент'
            }
          },
          category: { id: 1, name: 'Ручной инструмент' },
          brand: { id: 1, name: 'Форсаж' }
        },
        requests: [],
        disassemblyParent: null,
        disassemblyChildren: []
      },
      {
        id: 2,
        serialNumber: 'FORS-002',
        productId: 2,
        disassemblyStatus: 'MONOLITH',
        cardStatus: 'ARRIVED',
        physicalStatus: 'IN_STORE',
        product: {
          id: 2,
          name: 'Ключ 10мм Форс',
          brand: 'Форс',
          price: 120,
          spineId: 1,
          spine: {
            id: 1,
            name: 'Ключ комбинированный 10мм',
            slug: 'combi-key-10mm',
            categoryId: 1,
            category: {
              id: 1,
              name: 'Ручной инструмент'
            }
          },
          category: { id: 1, name: 'Ручной инструмент' },
          brand: { id: 2, name: 'Форс' }
        },
        requests: [],
        disassemblyParent: null,
        disassemblyChildren: []
      },
      {
        id: 3,
        serialNumber: 'DT-001',
        productId: 3,
        disassemblyStatus: 'MONOLITH',
        cardStatus: 'ARRIVED',
        physicalStatus: 'IN_STORE',
        product: {
          id: 3,
          name: 'Ключ 12мм Форсаж',
          brand: 'Форсаж',
          price: 170,
          spineId: 2,
          spine: {
            id: 2,
            name: 'Ключ комбинированный 12мм',
            slug: 'combi-key-12mm',
            categoryId: 1,
            category: {
              id: 1,
              name: 'Ручной инструмент'
            }
          },
          category: { id: 1, name: 'Ручной инструмент' },
          brand: { id: 1, name: 'Форсаж' }
        },
        requests: [],
        disassemblyParent: null,
        disassemblyChildren: []
      },
      {
        id: 4,
        serialNumber: 'DRILL-001',
        productId: 4,
        disassemblyStatus: 'MONOLITH',
        cardStatus: 'IN_REQUEST',
        physicalStatus: 'IN_STORE',
        product: {
          id: 4,
          name: 'Дрель Pro',
          brand: 'Bosch',
          price: 250,
          spineId: 3,
          spine: {
            id: 3,
            name: 'Дрель электрическая',
            slug: 'electric-drill',
            categoryId: 2,
            category: {
              id: 2,
              name: 'Электроинструмент'
            }
          },
          category: { id: 2, name: 'Электроинструмент' },
          brand: { id: 3, name: 'Bosch' }
        },
        requests: [],
        disassemblyParent: null,
        disassemblyChildren: []
      }
    ],
    activeRequests: [
      {
        id: 1,
        status: 'PENDING',
        units: [
          {
            id: 4,
            serialNumber: 'DRILL-001',
            productId: 4,
            product: {
              id: 4,
              name: 'Дрель Pro',
              spine: {
                id: 3,
                name: 'Дрель электрическая'
              }
            }
          }
        ]
      }
    ]
  }
}