// app/lib/saleService.ts
import prisma from '@/app/lib/prisma';
import { ProductUnitPhysicalStatus, CashEventType } from '@prisma/client';
import { ProductUnitLogger } from '@/app/lib/productUnitLogger';
import { CashDayService } from './cashDayService';

export interface SaleData {
  unitId: number;
  salePrice: number;
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  isCredit: boolean;
  notes?: string;
}

export interface SaleResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class SaleService {
  /**
   * Продажа товара (только если день открыт)
   */
  static async sellUnit(saleData: SaleData): Promise<SaleResult> {
    try {
      // 1. Проверяем что торговый день открыт
      await CashDayService.validateCashDayOpen();
      const currentCashDay = await CashDayService.getCurrentCashDay();

      return await prisma.$transaction(async (tx) => {
        const { unitId, salePrice, customerId, customerName, customerPhone, isCredit, notes } = saleData;

        // 2. Проверяем unit
        const unit = await tx.productUnit.findUnique({
          where: { id: unitId },
          include: { product: true }
        });

        if (!unit) {
          throw new Error('Unit not found');
        }

        if (unit.statusProduct !== ProductUnitPhysicalStatus.IN_STORE) {
          throw new Error('Unit is not in store');
        }

        // 3. Определяем финальный статус
        const finalStatus = isCredit ? ProductUnitPhysicalStatus.CREDIT : ProductUnitPhysicalStatus.SOLD;

        // 4. Обновляем unit
        const updatedUnit = await tx.productUnit.update({
          where: { id: unitId },
          data: {
            statusProduct: finalStatus,
            salePrice: salePrice,
            soldAt: new Date(),
            customerId: customerId || null,
            isCredit: isCredit,
            creditPaidAt: isCredit ? null : new Date(),
            logs: {
              create: {
                type: 'SALE',
                message: `Товар продан${isCredit ? ' в кредит' : ''} за ${salePrice} руб.`,
                meta: {
                  event: isCredit ? 'SOLD_CREDIT' : 'SOLD',
                  salePrice,
                  customerId,
                  customerName,
                  isCredit,
                  cashDayId: currentCashDay.id
                }
              }
            }
          },
          include: {
            product: true,
            customer: true,
            spine: true
          }
        });

        // 5. Создаем CashEvent ТОЛЬКО если не кредит
        if (!isCredit) {
          await tx.cashEvent.create({
            data: {
              type: CashEventType.SALE,
              amount: salePrice,
              notes: notes || `Продажа: ${unit.product.name}`,
              cashDayId: currentCashDay.id,
              productUnitId: unitId
            }
          });
        }

        return {
          success: true,
          data: {
            unit: updatedUnit,
            cashDay: currentCashDay,
            message: `Товар успешно ${isCredit ? 'продан в кредит' : 'продан'}`
          }
        };
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Оплата кредита (только если день открыт)
   */
  static async payCredit(unitId: number, amountPaid: number): Promise<SaleResult> {
    try {
      // 1. Проверяем что торговый день открыт
      await CashDayService.validateCashDayOpen();
      const currentCashDay = await CashDayService.getCurrentCashDay();

      return await prisma.$transaction(async (tx) => {
        // 2. Проверяем unit
        const unit = await tx.productUnit.findUnique({
          where: { id: unitId }
        });

        if (!unit) {
          throw new Error('Unit not found');
        }

        if (!unit.isCredit || unit.statusProduct !== ProductUnitPhysicalStatus.CREDIT) {
          throw new Error('Unit is not on credit');
        }

        // 3. Обновляем unit
        const updatedUnit = await tx.productUnit.update({
          where: { id: unitId },
          data: {
            statusProduct: ProductUnitPhysicalStatus.SOLD,
            creditPaidAt: new Date(),
            salePrice: amountPaid,
            logs: {
              create: {
                type: 'CREDIT_PAYMENT',
                message: `Кредит погашен на сумму ${amountPaid} руб.`,
                meta: {
                  event: 'CREDIT_PAID',
                  amountPaid,
                  cashDayId: currentCashDay.id
                }
              }
            }
          },
          include: {
            product: true,
            customer: true
          }
        });

        // 4. Создаем CashEvent для оплаты кредита
        await tx.cashEvent.create({
          data: {
            type: CashEventType.SALE,
            amount: amountPaid,
            notes: `Оплата кредита: ${unit.productName}`,
            cashDayId: currentCashDay.id,
            productUnitId: unitId
          }
        });

        return {
          success: true,
          data: {
            unit: updatedUnit,
            cashDay: currentCashDay,
            message: 'Кредит успешно погашен'
          }
        };
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Возврат товара (только если день открыт)
   */
  static async returnUnit(unitId: number, reason?: string): Promise<SaleResult> {
    try {
      // 1. Проверяем что торговый день открыт
      await CashDayService.validateCashDayOpen();
      const currentCashDay = await CashDayService.getCurrentCashDay();

      return await prisma.$transaction(async (tx) => {
        // 2. Проверяем unit
        const unit = await tx.productUnit.findUnique({
          where: { id: unitId }
        });

        if (!unit) {
          throw new Error('Unit not found');
        }

        if (unit.statusProduct !== ProductUnitPhysicalStatus.SOLD && 
            unit.statusProduct !== ProductUnitPhysicalStatus.CREDIT) {
          throw new Error('Unit is not sold');
        }

        // 3. Обновляем unit
        const updatedUnit = await tx.productUnit.update({
          where: { id: unitId },
          data: {
            statusProduct: ProductUnitPhysicalStatus.IN_STORE,
            isReturned: true,
            returnedAt: new Date(),
            logs: {
              create: {
                type: 'RETURN',
                message: `Товар возвращен${reason ? ` (${reason})` : ''}`,
                meta: {
                  event: 'RETURN',
                  reason,
                  cashDayId: currentCashDay.id
                }
              }
            }
          },
          include: {
            product: true,
            customer: true
          }
        });

        // 4. Создаем CashEvent для возврата (отрицательная сумма)
        if (unit.salePrice && unit.salePrice > 0) {
          await tx.cashEvent.create({
            data: {
              type: CashEventType.RETURN,
              amount: -unit.salePrice,
              notes: `Возврат: ${unit.productName}${reason ? ` (${reason})` : ''}`,
              cashDayId: currentCashDay.id,
              productUnitId: unitId
            }
          });
        }

        return {
          success: true,
          data: {
            unit: updatedUnit,
            cashDay: currentCashDay,
            message: 'Товар успешно возвращен'
          }
        };
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Получить товары готовые к продаже (IN_STORE)
   */
  static async getAvailableForSale() {
    const availableUnits = await prisma.productUnit.findMany({
      where: {
        statusProduct: ProductUnitPhysicalStatus.IN_STORE
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            images: {
              where: { isMain: true },
              take: 1
            }
          }
        },
        spine: true,
        supplier: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return availableUnits;
  }

  /**
   * Получить товары в кредите
   */
  static async getCreditUnits() {
    const creditUnits = await prisma.productUnit.findMany({
      where: {
        isCredit: true,
        statusProduct: ProductUnitPhysicalStatus.CREDIT
      },
      include: {
        product: true,
        customer: true
      },
      orderBy: {
        soldAt: 'asc'
      }
    });

    return creditUnits;
  }

  /**
   * Получить статистику продаж за период
   */
  static async getSalesStats(startDate: Date, endDate: Date) {
    const sales = await prisma.productUnit.findMany({
      where: {
        statusProduct: ProductUnitPhysicalStatus.SOLD,
        soldAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true
          }
        }
      }
    });

    const totalRevenue = sales.reduce((sum, unit) => sum + (unit.salePrice || 0), 0);
    const unitsSold = sales.length;
    const averagePrice = unitsSold > 0 ? totalRevenue / unitsSold : 0;

    // Группировка по брендам
    const byBrand: { [brandName: string]: any } = {};
    sales.forEach(unit => {
      const brandName = unit.product?.brand?.name || 'Без бренда';
      if (!byBrand[brandName]) {
        byBrand[brandName] = {
          count: 0,
          revenue: 0,
          units: []
        };
      }
      byBrand[brandName].count++;
      byBrand[brandName].revenue += unit.salePrice || 0;
      byBrand[brandName].units.push(unit);
    });

    return {
      period: { startDate, endDate },
      summary: {
        totalRevenue,
        unitsSold,
        averagePrice
      },
      byBrand
    };
  }

  /**
   * Поиск товаров для продажи по артикулу или названию
   */
  static async searchProductsForSale(query: string) {
    const searchResults = await prisma.productUnit.findMany({
      where: {
        AND: [
          { statusProduct: ProductUnitPhysicalStatus.IN_STORE },
          {
            OR: [
              { productCode: { contains: query, mode: 'insensitive' } },
              { productName: { contains: query, mode: 'insensitive' } },
              { product: { 
                  OR: [
                    { code: { contains: query, mode: 'insensitive' } },
                    { name: { contains: query, mode: 'insensitive' } }
                  ]
                } 
              }
            ]
          }
        ]
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            images: {
              where: { isMain: true },
              take: 1
            }
          }
        },
        spine: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        productName: 'asc'
      },
      take: 50 // ограничиваем результаты
    });

    // Группируем по Spine для удобства отображения карточек
    const groupedBySpine: { [spineId: number]: any } = {};
    
    searchResults.forEach(unit => {
      if (unit.spineId && !groupedBySpine[unit.spineId]) {
        groupedBySpine[unit.spineId] = {
          spine: unit.spine,
          units: []
        };
      }
      if (unit.spineId) {
        groupedBySpine[unit.spineId].units.push(unit);
      }
    });

    return {
      query,
      totalResults: searchResults.length,
      bySpine: Object.values(groupedBySpine)
    };
  }
}