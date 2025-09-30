import { PrismaClient, ProductUnitCardStatus } from '@prisma/client';
import { generateSerialNumber, recalcProductUnitStats } from '@/app/api/product-units/helpers';

const prisma = new PrismaClient();

export interface CreateRequestResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class RequestService {
  static async createRequest(unitId: number, quantity: number): Promise<CreateRequestResult> {
    try {
      const parentUnit = await prisma.productUnit.findUnique({
        where: { id: unitId },
        include: { product: true },
      });

      if (!parentUnit) return { success: false, error: "ProductUnit not found" };
      if (parentUnit.statusCard !== ProductUnitCardStatus.CANDIDATE)
        return { success: false, error: "Unit is not a candidate" };

      if (quantity === 1) {
        return await this.createSingleRequest(parentUnit);
      } else {
        return await this.createMultipleRequests(parentUnit, quantity);
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  private static async createSingleRequest(parentUnit: any): Promise<CreateRequestResult> {
    const updatedUnit = await prisma.productUnit.update({
      where: { id: parentUnit.id },
      data: {
        statusCard: ProductUnitCardStatus.IN_REQUEST,
        quantityInRequest: 1,
        createdAtRequest: new Date(),
        logs: {
          create: {
            type: "SYSTEM",
            message: `Unit перемещен в заявку (1 шт.)`,
            meta: { event: "MOVED_TO_REQUEST", quantity: 1, type: "SINGLE" },
          },
        },
      },
      include: { logs: true },
    });

    await recalcProductUnitStats(parentUnit.productId);

    return { success: true, data: { type: "single", unit: updatedUnit } };
  }

  private static async createMultipleRequests(parentUnit: any, quantity: number): Promise<CreateRequestResult> {
    const sproutedUnit = await prisma.productUnit.update({
      where: { id: parentUnit.id },
      data: {
        statusCard: ProductUnitCardStatus.SPROUTED,
        logs: {
          create: {
            type: "SYSTEM",
            message: `Unit sprouted (${quantity} шт.)`,
            meta: { event: "SPROUTED", quantity, childrenCount: quantity, type: "MULTIPLE" },
          },
        },
      },
      include: { logs: true },
    });

    const childUnits = [];
    for (let i = 1; i <= quantity; i++) {
      const serialNumber = await generateSerialNumber(prisma, parentUnit.productId, parentUnit.id, i, quantity);

      const childUnit = await prisma.productUnit.create({
        data: {
          productId: parentUnit.productId,
          spineId: parentUnit.spineId,
          parentProductUnitId: parentUnit.id,
          productCode: parentUnit.productCode,
          productName: parentUnit.productName,
          productDescription: parentUnit.productDescription,
          productCategoryId: parentUnit.productCategoryId,
          productCategoryName: parentUnit.productCategoryName,
          serialNumber,
          statusCard: ProductUnitCardStatus.IN_REQUEST,
          quantityInRequest: 1,
          createdAtRequest: new Date(),
          requestPricePerUnit: parentUnit.requestPricePerUnit,
          logs: {
            create: {
              type: "SYSTEM",
              message: `Дочерняя unit создана из sprouted`,
              meta: {
                event: "CREATED_FROM_SPROUTED",
                parentUnitId: parentUnit.id,
                index: i,
                total: quantity,
                sproutedFrom: parentUnit.serialNumber,
              },
            },
          },
        },
      });

      childUnits.push(childUnit);
    }

    await recalcProductUnitStats(parentUnit.productId);

    return {
      success: true,
      data: { type: "multiple", sprouted: sproutedUnit, children: childUnits, childrenCount: childUnits.length },
    };
  }
}
