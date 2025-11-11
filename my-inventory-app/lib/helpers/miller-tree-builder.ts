// lib/helpers/miller-tree-builder.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type MillerTreeNode = {
  id: number;
  name: string;
  path: string;
  type: 'category' | 'spine' | 'product';
  hasChildren: boolean;
  children?: MillerTreeNode[];
  code?: string;
  brand?: string;
};

export class MillerTreeBuilder {
  private totalSpines = 0;
  private totalProducts = 0;

  // Рекурсивно строим дерево категории
  async buildCategoryTree(categoryId?: number): Promise<MillerTreeNode[]> {
    // Получаем категории (корневые или дети)
    const categories = await prisma.category.findMany({
      where: categoryId ? { parent_id: categoryId } : { parent_id: null },
      include: {
        children: true, // Рекурсия через children
        spines: {
          include: {
            products: {
              include: {
                brand: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const result: MillerTreeNode[] = [];

    for (const category of categories) {
      // Рекурсивно обрабатываем дочерние категории
      const childCategories = await this.buildCategoryTree(category.id);
      
      // Обрабатываем spine'ы этой категории
      const categorySpines = category.spines.map(spine => {
        this.totalSpines++;
        
        const spineProducts = spine.products.map(product => {
          this.totalProducts++;
          return {
            id: product.id,
            name: product.name,
            code: product.code,
            path: product.node_index?.replace('structure/', '') || product.code,
            type: 'product' as const,
            hasChildren: false,
            brand: product.brand?.name
          };
        });

        return {
          id: spine.id,
          name: spine.name,
          path: spine.node_index?.replace('structure/', '') || spine.slug,
          type: 'spine' as const,
          hasChildren: spineProducts.length > 0,
          children: spineProducts
        };
      });

      const categoryNode: MillerTreeNode = {
        id: category.id,
        name: category.name,
        path: category.node_index?.replace('structure/', '') || category.path,
        type: 'category' as const,
        hasChildren: childCategories.length > 0 || categorySpines.length > 0,
        children: [...childCategories, ...categorySpines]
      };

      result.push(categoryNode);
    }

    return result;
  }

  // Получаем статистику
  getStats() {
    return {
      totalSpines: this.totalSpines,
      totalProducts: this.totalProducts
    };
  }

  // Сбрасываем счетчики
  resetCounters() {
    this.totalSpines = 0;
    this.totalProducts = 0;
  }
}