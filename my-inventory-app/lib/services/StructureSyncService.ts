// lib/services/StructureSyncService.ts
import { PrismaClient } from '@prisma/client';
import { StructureService } from './StructureService';
import { CategorySync } from './sync/CategorySync';
import { SpineSync } from './sync/SpineSync';
import { ProductSync } from './sync/ProductSync';
import { DeleteSync } from './sync/DeleteSync';

const prisma = new PrismaClient();

export class StructureSyncService {
  private structureService = new StructureService();
  private categorySync = new CategorySync();
  private spineSync = new SpineSync();
  private productSync = new ProductSync();
  private deleteSync = new DeleteSync();

  async syncCategory(name: string, parentPath: string = '') {
    return this.categorySync.sync(name, parentPath);
  }

  async syncSpine(name: string, parentPath: string = '', categoryId?: number) {
    return this.spineSync.sync(name, parentPath, categoryId);
  }

  // ОБНОВЛЯЕМ ДЛЯ ПЕРЕДАЧИ ИЗОБРАЖЕНИЙ
  async syncProduct(
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
    return this.productSync.sync(
      code, name, parentPath, spineId, brandId, categoryId, description, supplierId, images
    );
  }

  async safeDeleteNode(nodePath: string) {
    return this.deleteSync.safeDelete(nodePath);
  }
}