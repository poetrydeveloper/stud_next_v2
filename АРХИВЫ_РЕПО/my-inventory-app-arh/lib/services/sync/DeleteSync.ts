//lib/services/sync/DeleteSync.ts
import { PrismaClient } from '@prisma/client';
import { StructureService } from '../StructureService';
import { BaseSync } from './BaseSync';

import { prisma } from '@/app/lib/prisma';

export class DeleteSync extends BaseSync {
  async safeDelete(nodePath: string): Promise<void> {
    let deletedFromFS = false;

    try {
      await prisma.$transaction(async (tx) => {
        const nodeType = this.getNodeTypeFromPath(nodePath);
        
        // 1. Удаляем из БД
        switch (nodeType) {
          case 'category':
            await tx.category.deleteMany({ where: { path: nodePath } });
            break;
          case 'spine':
            await tx.spine.deleteMany({ where: { node_index: nodePath } });
            break;
          case 'product':
            await tx.product.deleteMany({ where: { node_index: nodePath } });
            break;
        }

        // 2. Удаляем из файловой системы
        await this.structureService.deleteNode(nodePath);
        deletedFromFS = true;
      });

    } catch (error) {
      await this.rollbackDeleteFromFS(deletedFromFS, nodePath);
      throw error;
    }
  }

  private async rollbackDeleteFromFS(deletedFromFS: boolean, nodePath: string) {
    if (deletedFromFS) {
      try {
        const fullPath = this.getFullPath('', nodePath);
        await this.fs.mkdir(fullPath, { recursive: true });
      } catch (rollbackError) {
        console.error('Ошибка восстановления файловой системы:', rollbackError);
      }
    }
  }
}