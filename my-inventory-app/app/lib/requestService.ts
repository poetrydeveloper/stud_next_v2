// app/lib/requestService.ts (обновленная версия)
import { RequestValidator } from '@/app/lib/requestValidator';
import prisma from '@/app/lib/prisma'

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
        data: { statusCard: ProductUnitCardStatus.SPROUTED }
      });

      await validator?.validateStep('parent_sprouted',
        async () => sproutedUnit.statusCard === 'SPROUTED',
        'Родительский unit переведен в SPROUTED'
      );

      // 3. Создание дочерних units с валидацией
      validator?.log(`🔄 Создание ${quantity} дочерних units...`);
      const childUnits = [];
      
      for (let i = 1; i <= quantity; i++) {
        const childUnit = await tx.productUnit.create({
          data: { /* ... данные ребенка ... */ }
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
        `Все ${quantity} дочерних units созданы и привязаны`
      );

      const result = { 
        success: true, 
        data: { /* ... данные результата ... */ } 
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