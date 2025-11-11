// lib/services/StructureService.ts
import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { validateSlug, StructureError, generateValidSlug } from '@/lib/helpers/structure-helpers';

import { prisma } from '@/app/lib/prisma';

export class StructureService {
  private basePath = path.join(process.cwd(), 'public', 'structure');

  async createCategory(name: string, parentPath: string = ''): Promise<string> {
    const slug = `d_${generateValidSlug(name)}`;
    return this.createDirectory(slug, parentPath);
  }

  async createSpine(name: string, parentPath: string = ''): Promise<string> {
    const slug = `s_${generateValidSlug(name)}`;
    return this.createDirectory(slug, parentPath);
  }

  async createProduct(
    code: string, 
    name: string, 
    description: string = '', 
    brandData?: any, 
    supplierData?: any, 
    categoryData?: any, 
    spineData?: any, 
    parentPath: string = '',
    images: any[] = []
  ): Promise<string> {
    const slug = `p_${generateValidSlug(code)}`;
    
    const cleanParentPath = this.normalizeAndCleanPath(parentPath);
    const nodeIndex = `structure/${path.join(cleanParentPath, slug)}`.replace(/\\/g, '/');
    
    const jsonData = {
      code,
      name,
      description: description || '',
      brand: brandData ? {
        id: brandData.id,
        name: brandData.name,
        slug: brandData.slug
      } : null,
      supplier: supplierData ? {
        id: supplierData.id,
        name: supplierData.name
      } : null,
      category: categoryData ? {
        id: categoryData.id,
        name: categoryData.name,
        node_index: categoryData.node_index,
        human_path: categoryData.human_path
      } : null,
      spine: spineData ? {
        id: spineData.id,
        name: spineData.name,
        node_index: spineData.node_index,
        human_path: spineData.human_path
      } : null,
      images: images.map((img, index) => ({
        filename: img.filename,
        path: img.path,
        isMain: index === 0,
        order: index
      })),
      node_index: nodeIndex,
      created_at: new Date().toISOString()
    };

    const jsonFilePath = path.join(this.basePath, cleanParentPath, `${slug}.json`);
    
    try {
      await fs.mkdir(path.dirname(jsonFilePath), { recursive: true });
      await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
      return nodeIndex;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
        throw new StructureError(`Файл уже существует: ${nodeIndex}`);
      }
      throw new StructureError(`Ошибка создания файла: ${error}`);
    }
  }

  private async createDirectory(slug: string, parentPath: string): Promise<string> {
    validateSlug(slug);
    
    const cleanParentPath = this.normalizeAndCleanPath(parentPath);
    const fullPath = path.join(this.basePath, cleanParentPath, slug);
    const nodeIndex = `structure/${path.join(cleanParentPath, slug)}`.replace(/\\/g, '/');

    try {
      await fs.mkdir(fullPath, { recursive: true });
      return nodeIndex;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
        throw new StructureError(`Директория уже существует: ${nodeIndex}`);
      }
      throw new StructureError(`Ошибка создания директории: ${error}`);
    }
  }

  private normalizeAndCleanPath(inputPath: string): string {
    if (!inputPath) return '';
    
    let normalized = inputPath.replace(/\\/g, '/');
    
    if (normalized.startsWith('structure/')) {
      normalized = normalized.substring('structure/'.length);
    }
    
    normalized = normalized.replace(/^\/+|\/+$/g, '');
    
    return normalized;
  }

  async getTree(): Promise<any> {
    const fileSystemTree = await this.scanDirectory(this.basePath);
    const enrichedTree = await this.enrichWithRussianNames(fileSystemTree);
    return enrichedTree;
  }

  private async scanDirectory(dirPath: string): Promise<any> {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      const tree: any = {};

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        const relativePath = path.relative(this.basePath, fullPath);

        if (item.isDirectory()) {
          tree[item.name] = {
            type: this.getNodeType(item.name),
            path: relativePath.replace(/\\/g, '/'),
            children: await this.scanDirectory(fullPath)
          };
        } else if (item.isFile() && item.name.endsWith('.json') && item.name.startsWith('p_')) {
          const productName = item.name.replace('.json', '');
          tree[item.name] = {
            type: 'product',
            path: relativePath.replace(/\\/g, '/'),
            children: {}
          };
        }
      }

      return tree;
    } catch (error) {
      throw new StructureError(`Ошибка чтения директории: ${error}`);
    }
  }

  private async enrichWithRussianNames(tree: any): Promise<any> {
    try {
      const [categories, spines, products] = await Promise.all([
        prisma.category.findMany({
          select: { 
            name: true,
            node_index: true
          }
        }),
        prisma.spine.findMany({
          select: { 
            name: true,
            node_index: true
          }
        }),
        prisma.product.findMany({
          select: { 
            name: true,
            code: true,
            node_index: true
          }
        })
      ]);

      // Создаем мапы для поиска по полному node_index
      const categoryMap = new Map();
      categories.forEach(cat => {
        if (cat.node_index && cat.name) {
          categoryMap.set(cat.node_index, cat.name);
        }
      });

      const spineMap = new Map();
      spines.forEach(spine => {
        if (spine.node_index && spine.name) {
          spineMap.set(spine.node_index, spine.name);
        }
      });

      const productMap = new Map();
      products.forEach(prod => {
        if (prod.node_index && prod.name) {
          productMap.set(prod.node_index, prod.name);
        }
        if (prod.code && prod.name) {
          productMap.set(prod.code, prod.name);
        }
      });

      return this.enrichNode(tree, categoryMap, spineMap, productMap);
      
    } catch (error) {
      console.error('Ошибка при обогащении дерева:', error);
      return tree;
    }
  }

  private enrichNode(
    node: any, 
    categoryMap: Map<string, string>,
    spineMap: Map<string, string>, 
    productMap: Map<string, string>
  ): any {
    const result: any = {};

    for (const [technicalName, data] of Object.entries(node)) {
      const nodeData = data as any;
      
      let russianName = technicalName;
      
      try {
        // ФИКС: ищем по полному пути "structure/..." а не по относительному
        const fullPath = `structure/${nodeData.path}`;
        
        if (nodeData.type === 'category') {
          russianName = categoryMap.get(fullPath) || technicalName;
        } else if (nodeData.type === 'spine') {
          russianName = spineMap.get(fullPath) || technicalName;
        } else if (nodeData.type === 'product') {
          // Для продуктов пробуем оба варианта
          const productCode = technicalName.replace('p_', '').replace('.json', '');
          russianName = productMap.get(fullPath) || productMap.get(productCode) || technicalName;
        }
      } catch (error) {
        console.error(`Ошибка обработки узла ${technicalName}:`, error);
      }

      result[technicalName] = {
        ...nodeData,
        name: russianName,
        children: nodeData.children ? 
          this.enrichNode(nodeData.children, categoryMap, spineMap, productMap) : 
          {}
      };
    }

    return result;
  }

  private getNodeType(name: string): string {
    if (name.startsWith('d_')) return 'category';
    if (name.startsWith('s_')) return 'spine';
    if (name.startsWith('p_') && name.endsWith('.json')) return 'product';
    if (name.startsWith('p_')) return 'product';
    return 'unknown';
  }

  async deleteNode(nodePath: string): Promise<void> {
    const cleanPath = this.normalizeAndCleanPath(nodePath);
    const fullPath = path.join(this.basePath, cleanPath);
    
    try {
      const stats = await fs.stat(fullPath);
      if (stats.isFile()) {
        await fs.rm(fullPath, { force: true });
      } else {
        await fs.rm(fullPath, { recursive: true, force: true });
      }
    } catch (error) {
      throw new StructureError(`Ошибка удаления: ${error}`);
    }
  }
}