//lib/services/sync/CategorySync.ts
import { PrismaClient } from '@prisma/client';
import { StructureService } from '@/lib/services/StructureService';
import { BaseSync } from './BaseSync';
import { generateValidSlug } from '@/lib/helpers/structure-helpers';

import { prisma } from '@/app/lib/prisma';

export class CategorySync extends BaseSync {
  async sync(name: string, parentPath: string = '') {
    let node_index: string;
    let createdDirPath: string | null = null;

    try {
      return await prisma.$transaction(async (tx) => {
        let parentCategoryId: number | null = null;

        // Проверяем существование родительской категории в БД
        if (parentPath) {
          console.log('🔍 Поиск родительской категории:', {
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
            // Альтернативный поиск если не нашли по node_index
            const allCategories = await tx.category.findMany();
            const fallbackParent = allCategories.find(cat => 
              cat.node_index && cat.node_index.replace(/\\/g, '/') === normalizedSearchPath
            );
            
            if (!fallbackParent) {
              throw new Error(`Родительская категория не найдена. Искали: "${normalizedSearchPath}"`);
            }
            
            parentCategoryId = fallbackParent.id;
          } else {
            parentCategoryId = parentCategory.id;
          }
          
          console.log('✅ Найдена родительская категория:', parentCategory);
        }

        // 1. Создаем в файловой системе
        console.log('📁 Создание категории в файловой системе:', { name, parentPath });
        node_index = await this.structureService.createCategory(name, parentPath);
        createdDirPath = this.getFullPath(parentPath, `d_${generateValidSlug(name)}`);

        console.log('📁 Создана директория:', node_index);

        // 2. Синхронизируем с БД
        const slug = generateValidSlug(name);
        const dbRecord = await tx.category.create({
          data: {
            name: name.trim(),
            slug: slug,
            path: node_index,
            node_index: node_index,
            human_path: this.generateHumanPath(node_index),
            parent_id: parentCategoryId
          }
        });

        console.log('💾 Создана запись в БД:', dbRecord);

        return { node_index, dbRecord };
      });

    } catch (error) {
      console.error('❌ Ошибка в CategorySync:', error);
      await this.rollbackFileSystem(createdDirPath);
      throw error;
    }
  }

  private async getParentCategoryId(parentPath: string, tx: any): Promise<number | null> {
    const normalizedSearchPath = `structure/${parentPath.replace(/\\/g, '/')}`;
    
    const parentCategory = await tx.category.findFirst({
      where: {
        node_index: normalizedSearchPath
      },
      select: { id: true }
    });
    
    return parentCategory?.id || null;
  }

  protected generateValidSlug(text: string): string {
    return generateValidSlug(text);
  }
}