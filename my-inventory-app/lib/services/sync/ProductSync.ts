//lib/services/sync/ProductSync.ts
import { PrismaClient } from '@prisma/client';
import { BaseSync } from './BaseSync';

const prisma = new PrismaClient();

export class ProductSync extends BaseSync {
  async sync(code: string, name: string, parentPath: string = '', spineId?: number, brandId?: number, categoryId?: number) {
    let node_index: string;
    let createdDirPath: string | null = null;

    try {
      return await prisma.$transaction(async (tx) => {
        // Проверяем существование родительского spine в БД
        if (parentPath) {
          // Нормализуем путь для поиска (заменяем \ на /)
          const normalizedParentPath = parentPath.replace(/\\/g, '/');
          
          // Ищем родительский spine по пути (содержит нормализованный путь)
          const parentSpine = await tx.spine.findFirst({
            where: { 
              OR: [
                { node_index: { contains: normalizedParentPath } },
                { node_index: { contains: parentPath } }
              ]
            }
          });
          
          if (!parentSpine) {
            throw new Error(`Родительский spine не найден: ${parentPath} (нормализованный: ${normalizedParentPath})`);
          }
          // Если spineId не передан, используем ID найденного spine
          if (!spineId) {
            spineId = parentSpine.id;
          }
          // Если categoryId не передан, используем categoryId из spine
          if (!categoryId) {
            categoryId = parentSpine.categoryId;
          }
        }

        node_index = await this.structureService.createProduct(code, parentPath);
        createdDirPath = this.getFullPath(parentPath, `p_${this.generateValidSlug(code)}`);

        const dbRecord = await tx.product.create({
          data: {
            code,
            name,
            spineId,
            brandId,
            categoryId,
            node_index,
            human_path: this.generateHumanPath(node_index)
          }
        });

        return { node_index, dbRecord };
      });

    } catch (error) {
      await this.rollbackFileSystem(createdDirPath);
      throw error;
    }
  }
}