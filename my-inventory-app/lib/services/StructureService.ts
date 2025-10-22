//lib/services/StructureService.ts
import fs from 'fs/promises';
import path from 'path';
import { validateSlug, StructureError, generateValidSlug } from '@/lib/helpers/structure-helpers';

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

  async createProduct(code: string, name: string, description: string = '', brandData?: any, supplierData?: any, categoryData?: any, spineData?: any, parentPath: string = ''): Promise<string> {
    const slug = `p_${generateValidSlug(code)}`;
    
    // ФИКС: нормализуем и очищаем parentPath от дублирования structure/
    const cleanParentPath = this.normalizeAndCleanPath(parentPath);
    
    // Генерируем node_index
    const nodeIndex = `structure/${path.join(cleanParentPath, slug)}`.replace(/\\/g, '/');
    
    // Создаем JSON данные
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
      node_index: nodeIndex,
      created_at: new Date().toISOString()
    };

    // Создаем путь к JSON файлу
    const jsonFilePath = path.join(this.basePath, cleanParentPath, `${slug}.json`);
    
    try {
      // Убеждаемся что родительская директория существует
      await fs.mkdir(path.dirname(jsonFilePath), { recursive: true });
      
      // Создаем JSON файл
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
    
    // ФИКС: нормализуем и очищаем parentPath от дублирования structure/
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
    
    // Нормализуем слеши
    let normalized = inputPath.replace(/\\/g, '/');
    
    // Убираем префикс structure/ если он есть
    if (normalized.startsWith('structure/')) {
      normalized = normalized.substring('structure/'.length);
    }
    
    // Убираем начальные и конечные слеши
    normalized = normalized.replace(/^\/+|\/+$/g, '');
    
    return normalized;
  }

  async getTree(): Promise<any> {
    return this.scanDirectory(this.basePath);
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
            path: relativePath,
            children: await this.scanDirectory(fullPath)
          };
        } else if (item.isFile() && item.name.endsWith('.json') && item.name.startsWith('p_')) {
          // Добавляем JSON файлы продуктов в дерево
          const productName = item.name.replace('.json', '').replace('p_', '');
          tree[item.name] = {
            type: 'product',
            path: relativePath,
            children: {} // У продуктов нет детей
          };
        }
      }

      return tree;
    } catch (error) {
      throw new StructureError(`Ошибка чтения директории: ${error}`);
    }
  }

  private getNodeType(name: string): string {
    if (name.startsWith('d_')) return 'category';
    if (name.startsWith('s_')) return 'spine';
    if (name.startsWith('p_') && name.endsWith('.json')) return 'product';
    if (name.startsWith('p_')) return 'product'; // для директорий (если остались)
    return 'unknown';
  }

  async deleteNode(nodePath: string): Promise<void> {
    const cleanPath = this.normalizeAndCleanPath(nodePath);
    const fullPath = path.join(this.basePath, cleanPath);
    
    try {
      // Проверяем, это файл или директория
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