// lib/services/sync/ProductSync.ts
import { PrismaClient } from '@prisma/client';
import { BaseSync } from './BaseSync';
import path from 'path';

const prisma = new PrismaClient();

export class ProductSync extends BaseSync {
  // ОБНОВЛЯЕМ МЕТОД SYNC ДЛЯ ИЗОБРАЖЕНИЙ
  async sync(
    code: string, 
    name: string, 
    parentPath: string = '', 
    spineId?: number, 
    brandId?: number, 
    categoryId?: number, 
    description?: string, 
    supplierId?: number,
    images: any[] = [] // ← ДОБАВЛЯЕМ ИЗОБРАЖЕНИЯ
  ) {
    let node_index: string;
    let createdFilePath: string | null = null;

    try {
      return await prisma.$transaction(async (tx) => {
        let brandData: any = null;
        let supplierData: any = null;
        let categoryData: any = null;
        let spineData: any = null;

        console.log('🔄 ProductSync: Начало создания продукта', {
          code, name, parentPath, spineId, brandId, categoryId, description, supplierId, imagesCount: images.length
        });

        // Получаем данные бренда если указан
        if (brandId) {
          brandData = await tx.brand.findUnique({
            where: { id: brandId }
          });
        }

        // Получаем данные поставщика если указан
        if (supplierId) {
          supplierData = await tx.supplier.findUnique({
            where: { id: supplierId }
          });
        }

        // Проверяем существование родительского spine в БД
        if (parentPath) {
          const normalizedParentPath = parentPath.replace(/\\/g, '/');
          
          const parentSpine = await tx.spine.findFirst({
            where: { 
              OR: [
                { node_index: { contains: normalizedParentPath } },
                { node_index: { contains: parentPath } }
              ]
            },
            include: {
              category: true
            }
          });
          
          if (!parentSpine) {
            throw new Error(`Родительский spine не найден: ${parentPath}`);
          }
          
          // ФИКС: Приводим типы number | null → number | undefined
          if (!spineId) spineId = parentSpine.id;
          if (!categoryId && parentSpine.categoryId) {
            categoryId = parentSpine.categoryId;
          }
          
          spineData = parentSpine;
          categoryData = parentSpine.category;
        }

        console.log('📁 ProductSync: Данные для создания', {
          spineId, categoryId, brandId, supplierId, imagesCount: images.length
        });

        // 1. Создаем JSON файл через StructureService С ИЗОБРАЖЕНИЯМИ
        node_index = await this.structureService.createProduct(
          code, 
          name, 
          description || '', 
          brandData, 
          supplierData, 
          categoryData, 
          spineData, 
          parentPath,
          images // ← ПЕРЕДАЕМ ИЗОБРАЖЕНИЯ
        );

        // Запоминаем путь к созданному файлу для отката
        const productSlug = `p_${this.generateValidSlug(code)}`;
        createdFilePath = path.join(this.basePath, parentPath, `${productSlug}.json`);

        console.log('💾 ProductSync: Создание записи в БД', {
          code, name, spineId, brandId, categoryId, node_index
        });

        // 2. Создаем запись в БД
        const dbRecord = await tx.product.create({
          data: {
            code,
            name,
            description: description || '',
            spineId: spineId || null,
            brandId: brandId || null,
            categoryId: categoryId || null,
            node_index,
            human_path: this.generateHumanPath(node_index)
          },
          include: {
            brand: true,
            category: true,
            spine: true
          }
        });

        console.log('✅ ProductSync: Продукт создан в БД', dbRecord.id);

        return { node_index, dbRecord };
      });

    } catch (error) {
      console.error('❌ ProductSync: Ошибка создания продукта:', error);
      
      if (error instanceof Error) {
        console.error('❌ ProductSync: Stack trace:', error.stack);
      } else {
        console.error('❌ ProductSync: Unknown error type:', error);
      }
      
      await this.rollbackFileSystem(createdFilePath);
      throw error;
    }
  }

  protected generateValidSlug(text: string): string {
    return text.toLowerCase()
      .replace(/[^a-z0-9а-яё]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}