// app/lib/unitCloneHelper.ts
import { PrismaClient, ProductUnitCardStatus } from '@prisma/client';
import { generateSerialNumber } from '@/app/api/product-units/helpers';

const prisma = new PrismaClient();

export class UnitCloneHelper {
  /**
   * Создает новую CLEAR unit на основе существующей (для продолжения цикла)
   */
  static async createClearClone(sourceUnitId: number): Promise<any> {
    const sourceUnit = await prisma.productUnit.findUnique({
      where: { id: sourceUnitId },
      include: { product: true }
    });

    if (!sourceUnit) {
      throw new Error('Source unit not found');
    }

    const newSerialNumber = await generateSerialNumber(prisma, sourceUnit.productId, null);

    return await prisma.productUnit.create({
      data: {
        // Копируем все основные данные
        productId: sourceUnit.productId,
        spineId: sourceUnit.spineId,
        supplierId: sourceUnit.supplierId,
        
        // Дублируемые данные из Product
        productCode: sourceUnit.productCode,
        productName: sourceUnit.productName,
        productDescription: sourceUnit.productDescription,
        productCategoryId: sourceUnit.productCategoryId,
        productCategoryName: sourceUnit.productCategoryName,
        productTags: sourceUnit.productTags,
        
        // Статус CLEAR для нового цикла
        statusCard: ProductUnitCardStatus.CLEAR,
        statusProduct: null,
        serialNumber: newSerialNumber,
        
        // Логируем создание
        logs: {
          create: {
            type: "SYSTEM",
            message: `CLEAR unit создана как клон для продолжения цикла`,
            meta: {
              event: "CLONED_FOR_CYCLE",
              sourceUnitId: sourceUnit.id,
              sourceSerialNumber: sourceUnit.serialNumber
            }
          }
        }
      }
    });
  }
}