// app/lib/unitCloneHelper.ts
import { PrismaClient, ProductUnitCardStatus } from '@prisma/client';
import { generateSerialNumber, copyProductDataToUnit } from '@/app/api/product-units/helpers';

import { prisma } from '@/app/lib/prisma';

export class UnitCloneHelper {
  /**
   * Создает новую CLEAR unit на основе существующей (для продолжения цикла)
   */
  static async createClearClone(sourceUnitId: number): Promise<any> {
    console.log("🔄 UnitCloneHelper: создаем CLEAR клон из unit:", sourceUnitId);

    const sourceUnit = await prisma.productUnit.findUnique({
      where: { id: sourceUnitId },
      include: { 
        product: {
          include: {
            brand: true,
            images: true,
            category: true
          }
        },
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!sourceUnit) {
      throw new Error('Source unit not found');
    }

    const newSerialNumber = await generateSerialNumber(prisma, sourceUnit.productId, undefined);

    console.log("📝 Создаем CLEAR клон с серийным номером:", newSerialNumber);

    const newUnit = await prisma.productUnit.create({
      data: {
        // Копируем все основные данные
        productId: sourceUnit.productId,
        spineId: sourceUnit.spineId,
        supplierId: sourceUnit.supplierId,
        
        // Дублируемые данные из Product
        ...copyProductDataToUnit(sourceUnit.product),
        
        // Статус CLEAR для нового цикла
        statusCard: ProductUnitCardStatus.CLEAR,
        statusProduct: null,
        serialNumber: newSerialNumber,
        requestPricePerUnit: sourceUnit.requestPricePerUnit,
        
        // 🔥 ГАРАНТИРУЕМ СОЗДАНИЕ ЛОГА
        logs: {
          create: {
            type: "SYSTEM",
            message: `CLEAR unit создан как замена для кандидата #${sourceUnit.serialNumber}`,
            meta: {
              sourceUnitId: sourceUnit.id,
              sourceSerialNumber: sourceUnit.serialNumber,
              sourceLastLog: sourceUnit.logs[0]?.message,
              purpose: "replacement_for_candidate"
            }
          }
        }
      },
      include: {
        logs: {
          orderBy: { createdAt: 'desc' }
        },
        product: {
          include: {
            brand: true,
            images: true
          }
        }
      }
    });

    console.log("✅ UnitCloneHelper: CLEAR клон создан:", {
      newUnitId: newUnit.id,
      newSerialNumber: newUnit.serialNumber,
      logsCreated: newUnit.logs.length,
      logMessage: newUnit.logs[0]?.message
    });

    return newUnit;
  }

  /**
   * Создает дочерние юниты для множественной заявки
   */
  static async createChildUnitsForRequest(
    parentUnitId: number, 
    quantity: number, 
    pricePerUnit: number
  ): Promise<any[]> {
    console.log("🔄 Создаем дочерние юниты для заявки:", {
      parentUnitId,
      quantity,
      pricePerUnit
    });

    const parentUnit = await prisma.productUnit.findUnique({
      where: { id: parentUnitId },
      include: { 
        product: true,
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!parentUnit) {
      throw new Error('Parent unit not found');
    }

    const childUnits = [];

    for (let i = 0; i < quantity; i++) {
      const childSerialNumber = `${parentUnit.serialNumber}/${i + 1}`;
      
      console.log(`📝 Создаем дочерний юнит ${i + 1}/${quantity}:`, childSerialNumber);

      const childUnit = await prisma.productUnit.create({
        data: {
          productId: parentUnit.productId,
          spineId: parentUnit.spineId,
          supplierId: parentUnit.supplierId,
          parentProductUnitId: parentUnitId,
          
          // Копируем данные продукта
          productCode: parentUnit.productCode,
          productName: parentUnit.productName,
          productDescription: parentUnit.productDescription,
          productCategoryId: parentUnit.productCategoryId,
          productCategoryName: parentUnit.productCategoryName,
          productTags: parentUnit.productTags,
          
          // Данные заявки
          serialNumber: childSerialNumber,
          statusCard: "IN_REQUEST",
          requestPricePerUnit: pricePerUnit,
          quantityInRequest: 1,
          createdAtRequest: new Date(),
          
          // 🔥 СОЗДАЕМ ЛОГ ДЛЯ КАЖДОГО ДОЧЕРНЕГО ЮНИТА
          logs: {
            create: {
              type: "REQUEST_CREATED",
              message: `Дочерний юнит создан для заявки из родителя #${parentUnit.serialNumber}`,
              meta: {
                parentUnitId: parentUnit.id,
                parentSerialNumber: parentUnit.serialNumber,
                requestPrice: pricePerUnit,
                childIndex: i + 1,
                totalChildren: quantity
              }
            }
          }
        },
        include: {
          logs: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      childUnits.push(childUnit);
      
      console.log(`✅ Дочерний юнит ${i + 1} создан:`, {
        childId: childUnit.id,
        serialNumber: childUnit.serialNumber,
        hasLogs: childUnit.logs.length > 0
      });
    }

    // 🔥 СОЗДАЕМ ЛОГ В РОДИТЕЛЬСКОМ ЮНИТЕ О СОЗДАНИИ ДЕТЕЙ
    await prisma.productUnitLog.create({
      data: {
        productUnitId: parentUnitId,
        type: "CHILDREN_CREATED", 
        message: `Создано ${quantity} дочерних юнитов для заявки по цене ${pricePerUnit} руб.`,
        meta: {
          childrenCount: quantity,
          pricePerUnit: pricePerUnit,
          childrenSerialNumbers: childUnits.map(unit => unit.serialNumber)
        }
      }
    });

    console.log("✅ Все дочерние юниты созданы:", {
      parentUnitId,
      childrenCount: childUnits.length,
      firstChild: childUnits[0]?.serialNumber,
      lastChild: childUnits[childUnits.length - 1]?.serialNumber
    });

    return childUnits;
  }
}