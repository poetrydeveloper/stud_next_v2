// app/lib/spineAggregationService.ts
import prisma from '@/app/lib/prisma';
import { ProductUnitCardStatus, ProductUnitPhysicalStatus } from '@prisma/client';

export interface SpineStats {
  spineId: number;
  spineName: string;
  totalUnits: number;
  byStatus: {
    [key in ProductUnitCardStatus]?: number;
  };
  byPhysicalStatus: {
    [key in ProductUnitPhysicalStatus]?: number;
  };
  byBrand: {
    [brandName: string]: {
      count: number;
      byStatus: { [status: string]: number };
    };
  };
  recentActivity?: {
    lastUpdated: Date;
    newCandidates: number;
    newRequests: number;
  };
}

export interface SpineAggregationResult {
  spineId: number;
  spineName: string;
  categoryName?: string;
  stats: SpineStats;
}

export class SpineAggregationService {
  /**
   * Получить агрегированную статистику для всех Spine
   */
  static async getAllSpinesStats(): Promise<SpineAggregationResult[]> {
    const spines = await prisma.spine.findMany({
      include: {
        category: true,
        productUnits: {
          include: {
            product: {
              include: {
                brand: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return spines.map(spine => this.calculateSpineStats(spine));
  }

  /**
   * Получить статистику для конкретного Spine
   */
  static async getSpineStats(spineId: number): Promise<SpineAggregationResult | null> {
    const spine = await prisma.spine.findUnique({
      where: { id: spineId },
      include: {
        category: true,
        productUnits: {
          include: {
            product: {
              include: {
                brand: true
              }
            }
          }
        }
      }
    });

    if (!spine) return null;

    return this.calculateSpineStats(spine);
  }

  /**
   * Получить статистику для Spine по категории
   */
  static async getSpinesByCategory(categoryId: number): Promise<SpineAggregationResult[]> {
    const spines = await prisma.spine.findMany({
      where: { categoryId },
      include: {
        category: true,
        productUnits: {
          include: {
            product: {
              include: {
                brand: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return spines.map(spine => this.calculateSpineStats(spine));
  }

  /**
   * Основная функция расчета статистики для Spine
   */
  private static calculateSpineStats(spine: any): SpineAggregationResult {
    const units = spine.productUnits || [];
    
    // Статистика по статусам карточек
    const byStatus: { [key in ProductUnitCardStatus]?: number } = {};
    Object.values(ProductUnitCardStatus).forEach(status => {
      byStatus[status] = units.filter((unit: any) => unit.statusCard === status).length;
    });

    // Статистика по физическим статусам
    const byPhysicalStatus: { [key in ProductUnitPhysicalStatus]?: number } = {};
    Object.values(ProductUnitPhysicalStatus).forEach(status => {
      byPhysicalStatus[status] = units.filter((unit: any) => unit.statusProduct === status).length;
    });

    // Статистика по брендам
    const byBrand: { [brandName: string]: any } = {};
    units.forEach((unit: any) => {
      const brandName = unit.product?.brand?.name || 'Без бренда';
      
      if (!byBrand[brandName]) {
        byBrand[brandName] = {
          count: 0,
          byStatus: {}
        };
      }

      byBrand[brandName].count++;
      byBrand[brandName].byStatus[unit.statusCard] = (byBrand[brandName].byStatus[unit.statusCard] || 0) + 1;
    });

    // Активность за последние 7 дней
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentActivity = {
      lastUpdated: new Date(),
      newCandidates: units.filter((unit: any) => 
        unit.createdAtCandidate && new Date(unit.createdAtCandidate) > weekAgo
      ).length,
      newRequests: units.filter((unit: any) => 
        unit.createdAtRequest && new Date(unit.createdAtRequest) > weekAgo
      ).length
    };

    const stats: SpineStats = {
      spineId: spine.id,
      spineName: spine.name,
      totalUnits: units.length,
      byStatus,
      byPhysicalStatus,
      byBrand,
      recentActivity
    };

    return {
      spineId: spine.id,
      spineName: spine.name,
      categoryName: spine.category?.name,
      stats
    };
  }

  /**
   * Быстрая агрегация только основных счетчиков (для списка Spine)
   */
  static async getSpinesQuickStats(): Promise<{
    spineId: number;
    spineName: string;
    clear: number;
    candidate: number;
    inRequest: number;
    inStore: number;
  }[]> {
    const spines = await prisma.spine.findMany({
      include: {
        productUnits: {
          select: {
            statusCard: true,
            statusProduct: true
          }
        }
      }
    });

    return spines.map(spine => {
      const units = spine.productUnits || [];
      
      return {
        spineId: spine.id,
        spineName: spine.name,
        clear: units.filter((u: any) => u.statusCard === 'CLEAR').length,
        candidate: units.filter((u: any) => u.statusCard === 'CANDIDATE').length,
        inRequest: units.filter((u: any) => u.statusCard === 'IN_REQUEST').length,
        inStore: units.filter((u: any) => u.statusProduct === 'IN_STORE').length
      };
    });
  }
}