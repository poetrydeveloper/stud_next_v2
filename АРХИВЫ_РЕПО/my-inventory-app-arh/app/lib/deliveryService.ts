// app/lib/deliveryService.ts
import prisma from '@/app/lib/prisma';
import { ProductUnitCardStatus, ProductUnitPhysicalStatus } from '@prisma/client';
import { ProductUnitLogger } from './productUnitLogger';

export interface DeliveryItem {
  unitId: number;
  quantityReceived: number;
  notes?: string;
}

export interface DeliveryResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class DeliveryService {
  /**
   * Подтверждение поставки - перевод units из IN_REQUEST в IN_DELIVERY
   */
  static async confirmDelivery(unitIds: number[], deliveryDate: Date = new Date()): Promise<DeliveryResult> {
    try {
      return await prisma.$transaction(async (tx) => {
        const updatedUnits = [];
        
        for (const unitId of unitIds) {
          const unit = await tx.productUnit.findUnique({
            where: { id: unitId }
          });

          if (!unit) {
            throw new Error(`Unit ${unitId} not found`);
          }

          if (unit.statusCard !== ProductUnitCardStatus.IN_REQUEST) {
            throw new Error(`Unit ${unitId} is not in IN_REQUEST status`);
          }

          // Обновляем статус на IN_DELIVERY
          const updatedUnit = await tx.productUnit.update({
            where: { id: unitId },
            data: {
              statusCard: ProductUnitCardStatus.IN_DELIVERY,
              // Здесь можно добавить поле deliveryDate если нужно
              logs: {
                create: {
                  type: 'DELIVERY',
                  message: `Товар переведен в доставку`,
                  meta: {
                    event: 'DELIVERY_STARTED',
                    deliveryDate: deliveryDate.toISOString()
                  }
                }
              }
            },
            include: {
              product: true,
              spine: true
            }
          });

          updatedUnits.push(updatedUnit);

          // Автоматически через 1 секунду переводим в IN_STORE (имитация получения)
          setTimeout(() => {
            this.completeDelivery(unitId).catch(console.error);
          }, 1000);
        }

        return {
          success: true,
          data: {
            message: `${unitIds.length} units переведены в доставку`,
            units: updatedUnits,
            deliveryDate
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
   * Завершение поставки - перевод из IN_DELIVERY в IN_STORE
   */
  static async completeDelivery(unitId: number, receivedDate: Date = new Date()): Promise<DeliveryResult> {
    try {
      const unit = await prisma.productUnit.findUnique({
        where: { id: unitId }
      });

      if (!unit) {
        return { success: false, error: 'Unit not found' };
      }

      if (unit.statusCard !== ProductUnitCardStatus.IN_DELIVERY) {
        return { success: false, error: 'Unit is not in delivery status' };
      }

      const updatedUnit = await prisma.productUnit.update({
        where: { id: unitId },
        data: {
          statusCard: ProductUnitCardStatus.CLEAR, // Возвращаем в CLEAR после поставки
          statusProduct: ProductUnitPhysicalStatus.IN_STORE,
          logs: {
            create: {
              type: 'DELIVERY',
              message: `Товар получен на склад`,
              meta: {
                event: 'DELIVERY_COMPLETED',
                receivedDate: receivedDate.toISOString(),
                storedAt: new Date().toISOString()
              }
            }
          }
        },
        include: {
          product: true,
          spine: true
        }
      });

      await ProductUnitLogger.logEvent(
        unitId,
        'STATUS_CHANGE',
        `Поставка завершена: товар на складе`,
        {
          oldStatus: 'IN_DELIVERY',
          newStatus: 'IN_STORE',
          receivedDate
        }
      );

      return {
        success: true,
        data: {
          message: 'Товар успешно получен на склад',
          unit: updatedUnit
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Получить список units готовых к поставке (IN_REQUEST)
   */
  static async getPendingDeliveries() {
    const pendingUnits = await prisma.productUnit.findMany({
      where: {
        statusCard: ProductUnitCardStatus.IN_REQUEST
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true
          }
        },
        spine: true,
        supplier: true
      },
      orderBy: {
        createdAtRequest: 'asc'
      }
    });

    // Группируем по Spine для удобства
    const groupedBySpine: { [spineId: number]: any } = {};
    
    pendingUnits.forEach(unit => {
      if (!groupedBySpine[unit.spineId!]) {
        groupedBySpine[unit.spineId!] = {
          spine: unit.spine,
          units: []
        };
      }
      groupedBySpine[unit.spineId!].units.push(unit);
    });

    return {
      total: pendingUnits.length,
      bySpine: Object.values(groupedBySpine)
    };
  }

  /**
   * Получить историю поставок
   */
  static async getDeliveryHistory(days: number = 30) {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const deliveryLogs = await prisma.productUnitLog.findMany({
      where: {
        type: 'DELIVERY',
        createdAt: {
          gte: sinceDate
        }
      },
      include: {
        productUnit: {
          include: {
            product: {
              include: {
                brand: true
              }
            },
            spine: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return deliveryLogs;
  }
}