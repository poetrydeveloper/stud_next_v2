//lib/services/sync/SpineSync.ts
import { PrismaClient } from '@prisma/client';
import { BaseSync } from './BaseSync';
import { generateValidSlug } from '@/lib/helpers/structure-helpers';

import { prisma } from '@/app/lib/prisma';

export class SpineSync extends BaseSync {
  async sync(name: string, parentPath: string = '', categoryId?: number) {
    let node_index: string;
    let createdDirPath: string | null = null;

    try {
      return await prisma.$transaction(async (tx) => {
        // Проверяем существование родительской категории в БД
        if (parentPath) {
          console.log('🔍 Поиск родительской категории для Spine:', {
            parentPath,
            normalized: parentPath.replace(/\\/g, '/')
          });

          // ФИКС: ищем по node_index который содержит полный путь
          const normalizedSearchPath = `structure/${parentPath.replace(/\\/g, '/')}`;
          
          const parentCategory = await tx.category.findFirst({
            where: {
              node_index: normalizedSearchPath
            }
          });
          
          if (!parentCategory) {
            throw new Error(`Родительская категория не найдена для Spine. Искали: "${normalizedSearchPath}"`);
          }
          
          // Если categoryId не передан, используем ID найденной категории
          if (!categoryId) {
            categoryId = parentCategory.id;
          }
          
          console.log('✅ Найдена родительская категория для Spine:', parentCategory);
        }

        node_index = await this.structureService.createSpine(name, parentPath);
        createdDirPath = this.getFullPath(parentPath, `s_${generateValidSlug(name)}`);

        const dbRecord = await tx.spine.create({
          data: {
            name,
            slug: generateValidSlug(name),
            categoryId,
            node_index,
            human_path: this.generateHumanPath(node_index)
          }
        });

        console.log('💾 Создан Spine в БД:', dbRecord);

        return { node_index, dbRecord };
      });

    } catch (error) {
      console.error('❌ Ошибка в SpineSync:', error);
      await this.rollbackFileSystem(createdDirPath);
      throw error;
    }
  }

  protected generateValidSlug(text: string): string {
    return generateValidSlug(text);
  }
}