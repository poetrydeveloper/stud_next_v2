// app/lib/unitCloneHelper.ts
import { PrismaClient, ProductUnitCardStatus } from '@prisma/client';
import { generateSerialNumber, copyProductDataToUnit } from '@/app/api/product-units/helpers';

const prisma = new PrismaClient();

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
        } 
      }
    });

    if (!sourceUnit) {
      throw new Error('Source unit not found');
    }

    const newSerialNumber = await generateSerialNumber(prisma, sourceUnit.productId, undefined);

    const newUnit = await prisma.productUnit.create({
      data: {
        // Копируем все основные данные
        productId: sourceUnit.productId,
        spineId: sourceUnit.spineId,
        supplierId: sourceUnit.supplierId,
        
        // Дублируемые данные из Product (используем существующую функцию)
        ...copyProductDataToUnit(sourceUnit.product),
        
        // Статус CLEAR для нового цикла
        statusCard: ProductUnitCardStatus.CLEAR,
        statusProduct: null,
        serialNumber: newSerialNumber,
        requestPricePerUnit: sourceUnit.requestPricePerUnit,
        
        // Логируем создание
        logs: {
          create: {
            type: "CLONE_CREATED",
            message: `CLEAR unit создана как замена для кандидата`,
            meta: {
              sourceUnitId: sourceUnit.id,
              sourceSerialNumber: sourceUnit.serialNumber,
              purpose: "replacement_for_candidate"
            }
          }
        }
      },
      include: {
        product: {
          include: {
            brand: true,
            images: true
          }
        }
      }
    });

    console.log("✅ UnitCloneHelper: CLEAR клон создан:", newUnit.serialNumber);
    return newUnit;
  }
}