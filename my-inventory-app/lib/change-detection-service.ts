import { prisma } from '@/app/lib/prisma'

export class ChangeDetectionService {
  private lastCheckTime: Date = new Date(0)
  
  async hasChangesSince(lastCheck: Date): Promise<boolean> {
    try {
      const [productChanges, unitChanges, eventChanges, trafficLightChanges] = await Promise.all([
        // Проверяем только по updatedAt
        prisma.product.findFirst({
          where: { updatedAt: { gt: lastCheck } },
          select: { id: true }
        }),
        
        prisma.productUnit.findFirst({
          where: {
            OR: [
              { updatedAt: { gt: lastCheck } },
              { soldAt: { gt: lastCheck } },
              { returnedAt: { gt: lastCheck } }
            ]
          },
          select: { id: true }
        }),
        
        prisma.cashEvent.findFirst({
          where: { createdAt: { gt: lastCheck } },
          select: { id: true }
        }),
        
        prisma.stockTrafficLight.findFirst({
          where: { updatedAt: { gt: lastCheck } },
          select: { id: true }
        })
      ])
      
      const hasChanges = !!(productChanges || unitChanges || eventChanges || trafficLightChanges)
      
      console.log(`[ChangeDetection] Changes since ${lastCheck.toISOString()}:`, {
        products: !!productChanges,
        units: !!unitChanges, 
        events: !!eventChanges,
        trafficLights: !!trafficLightChanges
      })
      
      return hasChanges
    } catch (error) {
      console.error('[ChangeDetection] Error checking changes:', error)
      return true
    }
  }
  
  setLastCheckTime(time: Date) {
    this.lastCheckTime = time
  }
  
  getLastCheckTime(): Date {
    return this.lastCheckTime
  }
}