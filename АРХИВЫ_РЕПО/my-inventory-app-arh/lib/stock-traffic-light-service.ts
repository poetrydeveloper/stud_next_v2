import { prisma } from '@/app/lib/prisma'
import { ChangeDetectionService } from './change-detection-service'

export interface ProductGroupStats {
  productCode: string
  brandName: string
  categoryId: number
  categoryName: string
  inStoreCount: number
  inRequestCount: number
  weeklySales: number
  totalCount: number
}

export class StockTrafficLightService {
  private changeDetection = new ChangeDetectionService()
  private cache: { data: any; timestamp: number } | null = null
  private readonly CACHE_DURATION = 15 * 60 * 1000
  
  /**
   * Автоматическое создание светофоров для всех продуктов
   */
  async initializeTrafficLights() {
    console.log('[TrafficLight] Initializing traffic lights...')
    const productGroups = await this.getProductGroupsStats()
    
    for (const group of productGroups) {
      await prisma.stockTrafficLight.upsert({
        where: { productCode: group.productCode },
        update: {
          weeklySales: group.weeklySales,
          category: group.categoryId ? { connect: { id: group.categoryId } } : undefined,
          // Убираем lastModified, используем стандартный updatedAt
        },
        create: {
          productCode: group.productCode,
          brandName: group.brandName,
          category: group.categoryId ? { connect: { id: group.categoryId } } : undefined,
          weeklySales: group.weeklySales,
          minStock: 1,
          normalStock: 2,
          goodStock: 3
        }
      })
    }
    
    console.log(`[TrafficLight] Initialized ${productGroups.length} traffic lights`)
  }

  /**
   * Умное получение данных с проверкой изменений
   */
  async getVisualizationData(forceRefresh = false): Promise<any[]> {
    const now = Date.now()
    
    if (forceRefresh) {
      console.log('[TrafficLight] Force refresh requested')
      return await this.refreshData()
    }
    
    if (this.cache && now - this.cache.timestamp < this.CACHE_DURATION) {
      console.log('[TrafficLight] Using cache')
      return this.cache.data
    }
    
    const lastCheck = this.changeDetection.getLastCheckTime()
    const hasChanges = await this.changeDetection.hasChangesSince(lastCheck)
    
    if (hasChanges) {
      console.log('[TrafficLight] Changes detected, refreshing data')
      const data = await this.refreshData()
      this.changeDetection.setLastCheckTime(new Date())
      this.cache = { data, timestamp: now }
      return data
    } else {
      console.log('[TrafficLight] No changes, using cache with extended duration')
      if (this.cache) {
        this.cache.timestamp = now
        return this.cache.data
      }
    }
    
    console.log('[TrafficLight] No cache, loading fresh data')
    const data = await this.refreshData()
    this.changeDetection.setLastCheckTime(new Date())
    this.cache = { data, timestamp: now }
    return data
  }
  
  /**
   * Обновляет данные (тяжелая операция)
   */
  private async refreshData() {
    console.log('[TrafficLight] Refreshing data from database...')
    
    const productGroups = await this.getProductGroupsStats()
    
    // Обновляем светофоры в БД - УБИРАЕМ lastModified
    for (const group of productGroups) {
      await prisma.stockTrafficLight.upsert({
        where: { productCode: group.productCode },
        update: { 
          weeklySales: group.weeklySales,
          category: group.categoryId ? { connect: { id: group.categoryId } } : undefined,
          // updatedAt обновится автоматически благодаря @updatedAt
        },
        create: {
          productCode: group.productCode,
          brandName: group.brandName,
          category: group.categoryId ? { connect: { id: group.categoryId } } : undefined,
          weeklySales: group.weeklySales,
          minStock: 1,
          normalStock: 2,
          goodStock: 3
        }
      })
    }
    
    // Получаем актуальные светофоры с категориями
    const trafficLights = await prisma.stockTrafficLight.findMany({
      include: {
        category: true
      }
    })
    
    // Формируем финальные данные
    const result = productGroups.map(group => {
      const trafficLight = trafficLights.find(tl => tl.productCode === group.productCode)
      
      return {
        ...group,
        trafficLight: trafficLight || {
          minStock: 1,
          normalStock: 2,
          goodStock: 3,
          weeklySales: group.weeklySales
        },
        color: this.getTrafficLightColor(
          group.inStoreCount,
          trafficLight?.minStock || 1,
          trafficLight?.normalStock || 2,
          trafficLight?.goodStock || 3
        )
      }
    })
    
    console.log(`[TrafficLight] Data refreshed: ${result.length} product groups`)
    return result
  }

  /**
   * Получение статистики по группам продуктов
   */
  async getProductGroupsStats(): Promise<ProductGroupStats[]> {
    const { startOfWeek, endOfWeek } = this.getWeekRange()
    
    const productUnits = await prisma.productUnit.findMany({
      include: {
        product: {
          include: {
            brand: true,
            category: true
          }
        }
      }
    })

    const groupsMap = new Map<string, ProductGroupStats>()

    for (const unit of productUnits) {
      const key = `${unit.product.code}_${unit.product.brand.name}`
      
      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          productCode: unit.product.code,
          brandName: unit.product.brand.name,
          categoryId: unit.product.categoryId || 0,
          categoryName: unit.product.category?.name || 'Без категории',
          inStoreCount: 0,
          inRequestCount: 0,
          weeklySales: 0,
          totalCount: 0
        })
      }

      const group = groupsMap.get(key)!
      
      // Подсчет статусов
      if (unit.statusProduct === 'IN_STORE') {
        group.inStoreCount++
      }
      if (unit.statusCard === 'IN_REQUEST') {
        group.inRequestCount++
      }
      
      // Подсчет продаж за неделю
      if (unit.soldAt && unit.soldAt >= startOfWeek && unit.soldAt <= endOfWeek) {
        group.weeklySales++
      }
      
      group.totalCount++
    }

    return Array.from(groupsMap.values())
  }

  /**
   * Определение цвета светофора
   */
  private getTrafficLightColor(currentStock: number, min: number, normal: number, good: number): string {
    if (currentStock < min) return 'red'
    if (currentStock < normal) return 'yellow'
    return 'green'
  }

  /**
   * Получение диапазона текущей недели (пн-вс)
   */
  private getWeekRange(): { startOfWeek: Date; endOfWeek: Date } {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - diffToMonday)
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)
    
    return { startOfWeek, endOfWeek }
  }

  /**
   * Добавление продукта в кандидаты
   */
  async addToCandidates(productCode: string, brandName: string) {
    const units = await prisma.productUnit.findMany({
      where: {
        product: {
          code: productCode,
          brand: { name: brandName }
        },
        statusCard: 'CLEAR'
      },
      take: 1
    })

    if (units.length > 0) {
      await prisma.productUnit.update({
        where: { id: units[0].id },
        data: { 
          statusCard: 'CANDIDATE',
          // updatedAt обновится автоматически
        }
      })
      
      this.cache = null
    }
  }

  /**
   * Очистка кэша
   */
  clearCache() {
    this.cache = null
    console.log('[TrafficLight] Cache cleared')
  }
}