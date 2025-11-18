// app/lib/node-index/NodeIndexService.ts
import { Category, Spine, Product } from "@prisma/client";
import prisma from "@/app/lib/prisma";

export class NodeIndexService {
  
  /**
   * Генерация индекса для новой категории
   */
  async generateCategoryIndex(parentCategory: Category | null, categoryName: string): Promise<{
    node_index: string;
    human_path: string;
  }> {
    // КОРНЕВАЯ категория
    if (!parentCategory) {
      // Для корневой категории используем счетчик
      const rootCategoriesCount = await prisma.category.count({
        where: { parent_id: null }
      });
      
      return {
        node_index: `${rootCategoriesCount}`, // 0, 1, 2, 3...
        human_path: `/${categoryName}`
      };
    }

    // Проверяем что родитель имеет node_index
    if (!parentCategory.node_index) {
      throw new Error("Родительская категория не имеет node_index");
    }

    // Получаем соседние категории (siblings) на этом уровне
    const siblings = await prisma.category.findMany({
      where: { 
        parent_id: parentCategory.id
      }
    });

    // Номер следующей ветки = количество siblings + 1
    const nextNumber = siblings.length + 1;
    
    // Уровень = текущий уровень родителя + 1
    const parentLevel = this.calculateLevel(parentCategory.node_index);
    const currentLevel = parentLevel + 1;

    return {
      node_index: `${parentCategory.node_index}_${currentLevel}V${nextNumber.toString().padStart(2, '0')}`,
      human_path: `${parentCategory.human_path}/${categoryName}`
    };
  }

  /**
   * Генерация индекса для Spine
   */
  async generateSpineIndex(category: Category, spineSlug: string, spineName: string): Promise<{
    node_index: string;
    human_path: string;
  }> {
    if (!category.node_index) {
      throw new Error("Категория не имеет node_index");
    }

    // Считаем spines в этой категории для уникальности
    const spinesCount = await prisma.spine.count({
      where: { categoryId: category.id }
    });

    return {
      node_index: `${category.node_index}_S${spinesCount + 1}[${spineSlug}]`,
      human_path: `${category.human_path}/${spineName}`
    };
  }

  /**
   * Генерация индекса для Product  
   */
  async generateProductIndex(spine: Spine, productCode: string, productName: string): Promise<{
    node_index: string;
    human_path: string;
  }> {
    if (!spine.node_index) {
      throw new Error("Spine не имеет node_index");
    }

    return {
      node_index: `${spine.node_index}_P[${productCode}]`,
      human_path: `${spine.human_path}/${productName}`
    };
  }

  /**
   * Расчет уровня вложенности по node_index
   */
  private calculateLevel(nodeIndex: string): number {
    if (!nodeIndex) return 0;
    
    // Для корневых категорий (0, 1, 2...) уровень = 0
    if (!nodeIndex.includes('_')) return 0;
    
    // Для вложенных категорий извлекаем уровень из последней части
    const parts = nodeIndex.split('_');
    const lastPart = parts[parts.length - 1];
    
    // Извлекаем число перед 'V' (например из "1V01" извлекаем 1)
    const levelMatch = lastPart.match(/^(\d+)V/);
    return levelMatch ? parseInt(levelMatch[1]) : 0;
  }

  // ... остальные методы остаются без изменений
  /**
   * ПЕРЕМЕЩЕНИЕ категории (и всех потомков)
   */
  async moveCategory(category: Category, newParent: Category | null): Promise<{
    success: boolean;
    oldIndex: string;
    newIndex: string;
    affectedNodes: number;
  }> {
    // Генерируем новый индекс для категории
    const newIndexes = await this.generateCategoryIndex(newParent, category.name);
    
    try {
      // Атомарно обновляем все индексы в транзакции
      const result = await prisma.$transaction(async (tx) => {
        let totalAffected = 0;
        
        // Обновляем саму категорию
        await tx.category.update({
          where: { id: category.id },
          data: {
            node_index: newIndexes.node_index,
            human_path: newIndexes.human_path,
            parent_id: newParent?.id || null
          }
        });
        totalAffected++;
        
        // Обновляем всех потомков (рекурсивно)
        totalAffected += await this.updateDescendantsIndexes(
          tx, 
          category.node_index!, 
          newIndexes.node_index,
          newIndexes.human_path
        );
        
        return totalAffected;
      });
      
      return {
        success: true,
        oldIndex: category.node_index!,
        newIndex: newIndexes.node_index,
        affectedNodes: result
      };
      
    } catch (error: any) {
      throw new Error(`Ошибка перемещения: ${error.message}`);
    }
  }

  /**
   * ПЕРЕИМЕНОВАНИЕ категории
   */
  async renameCategory(category: Category, newName: string): Promise<{
    success: boolean;
    oldHumanPath: string;
    newHumanPath: string;
  }> {
    const oldHumanPath = category.human_path!;
    const pathParts = oldHumanPath.split('/');
    pathParts[pathParts.length - 1] = newName;
    const newHumanPath = pathParts.join('/');

    await prisma.category.update({
      where: { id: category.id },
      data: { 
        name: newName,
        human_path: newHumanPath 
      }
    });

    // Обновляем human_path у всех потомков
    await this.updateDescendantsHumanPaths(category.node_index!, oldHumanPath, newHumanPath);

    return {
      success: true,
      oldHumanPath,
      newHumanPath
    };
  }

  /**
   * УДАЛЕНИЕ категории (и всех потомков)
   */
  async deleteCategory(category: Category): Promise<{
    success: boolean;
    deletedNodes: number;
  }> {
    // Сначала находим всех потомков для отчета
    const allDescendants = await this.findAllDescendants(category.node_index!);
    
    // Удаляем в транзакции
    const result = await prisma.$transaction(async (tx) => {
      // Удаляем все продукты в этих spines
      await tx.product.deleteMany({
        where: { 
          spine: { 
            categoryId: category.id 
          } 
        }
      });
      
      // Удаляем все spines в категории и потомках
      await tx.spine.deleteMany({
        where: { 
          OR: [
            { categoryId: category.id },
            { category: { node_index: { startsWith: `${category.node_index}_` } } }
          ]
        }
      });
      
      // Удаляем все категории-потомки
      await tx.category.deleteMany({
        where: { node_index: { startsWith: `${category.node_index}_` } }
      });
      
      // Удаляем саму категорию
      await tx.category.delete({
        where: { id: category.id }
      });
      
      return allDescendants.length + 1;
    });

    return {
      success: true,
      deletedNodes: result
    };
  }

  /**
   * Вспомогательные методы
   */
  private async updateDescendantsIndexes(
    tx: any,
    oldIndexPrefix: string,
    newIndexPrefix: string,
    newHumanPathPrefix: string
  ): Promise<number> {
    let totalAffected = 0;

    // Обновляем дочерние категории
    const childCategories = await tx.category.findMany({
      where: { node_index: { startsWith: `${oldIndexPrefix}_` } }
    });

    for (const child of childCategories) {
      const newIndex = child.node_index!.replace(oldIndexPrefix, newIndexPrefix);
      const newHumanPath = child.human_path!.replace(
        this.extractPathPrefix(child.human_path!),
        newHumanPathPrefix
      );

      await tx.category.update({
        where: { id: child.id },
        data: { node_index: newIndex, human_path: newHumanPath }
      });
      totalAffected++;

      // Рекурсивно обновляем потомков
      totalAffected += await this.updateDescendantsIndexes(
        tx, child.node_index!, newIndex, newHumanPath
      );
    }

    // Обновляем spines
    const spines = await tx.spine.findMany({
      where: { node_index: { startsWith: `${oldIndexPrefix}_` } }
    });

    for (const spine of spines) {
      const newIndex = spine.node_index!.replace(oldIndexPrefix, newIndexPrefix);
      const newHumanPath = spine.human_path!.replace(
        this.extractPathPrefix(spine.human_path!),
        newHumanPathPrefix
      );

      await tx.spine.update({
        where: { id: spine.id },
        data: { node_index: newIndex, human_path: newHumanPath }
      });
      totalAffected++;

      // Обновляем продукты этого spine
      await tx.product.updateMany({
        where: { spineId: spine.id },
        data: { 
          node_index: newIndex + `_P[...]`,
          human_path: newHumanPath + `/...`
        }
      });
    }

    return totalAffected;
  }

  private async updateDescendantsHumanPaths(
    parentIndex: string,
    oldHumanPathPrefix: string,
    newHumanPathPrefix: string
  ): Promise<void> {
    // Обновляем категории
    await prisma.category.updateMany({
      where: { node_index: { startsWith: `${parentIndex}_` } },
      data: { 
        human_path: { 
          set: prisma.$executeRaw`REPLACE(human_path, ${oldHumanPathPrefix}, ${newHumanPathPrefix})`
        }
      }
    });

    // Обновляем spines
    await prisma.spine.updateMany({
      where: { node_index: { startsWith: `${parentIndex}_` } },
      data: { 
        human_path: { 
          set: prisma.$executeRaw`REPLACE(human_path, ${oldHumanPathPrefix}, ${newHumanPathPrefix})`
        }
      }
    });

    // Обновляем products
    await prisma.product.updateMany({
      where: { node_index: { startsWith: `${parentIndex}_` } },
      data: { 
        human_path: { 
          set: prisma.$executeRaw`REPLACE(human_path, ${oldHumanPathPrefix}, ${newHumanPathPrefix})`
        }
      }
    });
  }

  private async findAllDescendants(parentIndex: string): Promise<Category[]> {
    return await prisma.category.findMany({
      where: { node_index: { startsWith: `${parentIndex}_` } }
    });
  }

  private extractPathPrefix(humanPath: string): string {
    const parts = humanPath.split('/');
    parts.pop();
    return parts.join('/') || '/';
  }
}

export const nodeIndexService = new NodeIndexService();