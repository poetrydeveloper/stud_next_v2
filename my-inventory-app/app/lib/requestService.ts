// app/lib/requestService.ts (ПОЛНЫЙ ИСПРАВЛЕННЫЙ КОД)
import { RequestValidator } from '@/app/lib/requestValidator';
import { UnitCloneHelper } from '@/app/lib/unitCloneHelper';
import prisma from '@/app/lib/prisma';
import { ProductUnitCardStatus } from '@prisma/client';

export interface CreateRequestResult {
  success: boolean;
  error?: string;
  data?: any;
  validationReport?: any;
}

export class RequestService {
  static async createRequest(unitId: number, quantity: number, requestPricePerUnit?: number): Promise<CreateRequestResult> {
    const validator = new RequestValidator(`create-request-${unitId}-${Date.now()}`);

    try {
      // 1. Валидация входных данных
      await validator.validateStep('input_validation', 
        async () => unitId > 0 && quantity > 0, 
        'Проверка входных параметров'
      );

      const parentUnit = await prisma.productUnit.findUnique({
        where: { id: unitId },
        include: { product: true },
      });

      // 2. Проверка существования unit
      await validator.validateStep('unit_exists',
        async () => !!parentUnit,
        'Unit существует в базе'
      );

      // 3. Проверка статуса CANDIDATE
      await validator.validateStep('unit_is_candidate',
        async () => parentUnit!.statusCard === ProductUnitCardStatus.CANDIDATE,
        'Unit имеет статус CANDIDATE'
      );

      if (quantity === 1) {
        return await this.createSingleRequest(parentUnit!, requestPricePerUnit, validator);
      } else {
        return await this.createMultipleRequests(parentUnit!, quantity, requestPricePerUnit, validator);
      }
    } catch (err: any) {
      validator.log(`💥 Критическая ошибка: ${err.message}`);
      const report = validator.printFinalReport();
      return { success: false, error: err.message, validationReport: report };
    }
  }

  private static async createSingleRequest(parentUnit: any, requestPricePerUnit?: number, validator?: RequestValidator): Promise<CreateRequestResult> {
    validator?.log('🔄 Создание одиночной заявки...');

    try {
      // Создаем CLEAR replacement unit
      validator?.log('🔄 Создание CLEAR replacement...');
      const newClearUnit = await UnitCloneHelper.createClearClone(parentUnit.id);
      
      // Обновляем родителя в IN_REQUEST
      validator?.log('🔄 Перевод в IN_REQUEST...');
      const updatedUnit = await prisma.productUnit.update({
        where: { id: parentUnit.id },
        data: { 
          statusCard: ProductUnitCardStatus.IN_REQUEST,
          requestPricePerUnit: requestPricePerUnit || parentUnit.requestPricePerUnit,
          createdAtRequest: new Date(),
          logs: {
            create: {
              type: "IN_REQUEST",
              message: `Создана одиночная заявка, цена: ${requestPricePerUnit || parentUnit.requestPricePerUnit}`,
              meta: {
                pricePerUnit: requestPricePerUnit || parentUnit.requestPricePerUnit,
                clearReplacementUnitId: newClearUnit.id
              }
            }
          }
        }
      });

      validator?.log('✅ Одиночная заявка создана');
      return { 
        success: true, 
        data: {
          parentUnit: updatedUnit,
          clearReplacementUnit: newClearUnit
        }
      };
    } catch (error: any) {
      validator?.log(`💥 Ошибка создания заявки: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  private static async createMultipleRequests(parentUnit: any, quantity: number, requestPricePerUnit?: number, validator?: RequestValidator): Promise<CreateRequestResult> {
    return await prisma.$transaction(async (tx) => {
      // 1. Создание CLEAR клона с валидацией
      validator?.log('🔄 Создание CLEAR клона...');
      const newClearUnit = await UnitCloneHelper.createClearClone(parentUnit.id);
      
      await validator?.validateStep('clear_clone_created',
        async () => {
          const unit = await tx.productUnit.findUnique({ where: { id: newClearUnit.id } });
          return unit?.statusCard === 'CLEAR';
        },
        'CLEAR клон создан и имеет правильный статус'
      );

      // 2. Обновление родителя в SPROUTED
      validator?.log('🔄 Преобразование родителя в SPROUTED...');
      const sproutedUnit = await tx.productUnit.update({
        where: { id: parentUnit.id },
        data: { 
          statusCard: ProductUnitCardStatus.SPROUTED,
          logs: {
            create: {
              type: "SPROUTED",
              message: `Unit преобразован в SPROUTED для создания ${quantity} дочерних заявок`,
              meta: {
                childrenCount: quantity,
                pricePerUnit: requestPricePerUnit
              }
            }
          }
        }
      });

      await validator?.validateStep('parent_sprouted',
        async () => sproutedUnit.statusCard === 'SPROUTED',
        'Родительский unit переведен в SPROUTED'
      );

      // 3. Создание дочерних units с валидацией
      validator?.log(`🔄 Создание ${quantity} дочерних units...`);
      const childUnits = [];
      
      for (let i = 1; i <= quantity; i++) {
        // ГЕНЕРИРУЕМ УНИКАЛЬНЫЙ SERIAL NUMBER
        const childSerialNumber = `${parentUnit.serialNumber}/child-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const childUnit = await tx.productUnit.create({
          data: {
            // ОБЯЗАТЕЛЬНОЕ ПОЛЕ - добавлено
            serialNumber: childSerialNumber,
            
            // Копируем данные от родителя
            productId: parentUnit.productId,
            spineId: parentUnit.spineId,
            supplierId: parentUnit.supplierId,
            productCode: parentUnit.productCode,
            productName: parentUnit.productName,
            productDescription: parentUnit.productDescription,
            productCategoryId: parentUnit.productCategoryId,
            productCategoryName: parentUnit.productCategoryName,
            productTags: parentUnit.productTags,
            
            // Данные для заявки
            statusCard: ProductUnitCardStatus.IN_REQUEST,
            requestPricePerUnit: requestPricePerUnit || parentUnit.requestPricePerUnit,
            parentProductUnitId: parentUnit.id,
            createdAtRequest: new Date(),
            
            // Логирование
            logs: {
              create: {
                type: "CHILD_CREATED",
                message: `Дочерний unit создан из SPROUTED родителя`,
                meta: {
                  parentUnitId: parentUnit.id,
                  sequence: i,
                  total: quantity
                }
              }
            }
          }
        });
        childUnits.push(childUnit);

        // Валидация каждого ребенка
        await validator?.validateStep(`child_${i}_created`,
          async () => {
            const unit = await tx.productUnit.findUnique({ where: { id: childUnit.id } });
            return unit?.statusCard === 'IN_REQUEST' && unit.parentProductUnitId === parentUnit.id;
          },
          `Дочерний unit ${i}/${quantity} создан и привязан`
        );
      }

      // 4. Финальная проверка целостности
      await validator?.validateStep('final_integrity_check',
        async () => {
          const childrenCount = await tx.productUnit.count({
            where: { parentProductUnitId: parentUnit.id, statusCard: 'IN_REQUEST' }
          });
          return childrenCount === quantity;
        },
        `Все ${quantity} дочерних units созданы и привязан`
      );

      const result = { 
        success: true, 
        data: {
          parent: sproutedUnit,
          children: childUnits,
          clearReplacementUnit: newClearUnit,
          childrenCount: quantity
        } 
      };

      // Печатаем финальный отчет
      if (validator) {
        const report = validator.printFinalReport();
        result.validationReport = report;
      }

      return result;
    });
  }
}