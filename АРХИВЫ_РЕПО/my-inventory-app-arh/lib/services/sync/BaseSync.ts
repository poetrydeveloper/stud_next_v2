//lib/services/sync/BaseSync.ts
import { StructureService } from '../StructureService';
import fs from 'fs/promises';
import path from 'path';

export abstract class BaseSync {
  protected structureService = new StructureService();
  protected basePath = path.join(process.cwd(), 'public', 'structure');
  protected fs = fs;

  protected generateHumanPath(node_index: string): string {
    return node_index
      .split('/')
      .filter(part => part)
      .map(part => {
        if (part.startsWith('d_')) return part.replace('d_', '');
        if (part.startsWith('s_')) return part.replace('s_', '');
        if (part.startsWith('p_')) return part.replace('p_', '');
        return part;
      })
      .join(' / ');
  }

  protected getNodeTypeFromPath(nodePath: string): string {
    const lastPart = nodePath.split('/').pop() || '';
    if (lastPart.startsWith('d_')) return 'category';
    if (lastPart.startsWith('s_')) return 'spine';
    if (lastPart.startsWith('p_')) return 'product';
    return 'unknown';
  }

  protected generateValidSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  protected getFullPath(parentPath: string, slug: string): string {
    return path.join(this.basePath, parentPath, slug);
  }

  protected async rollbackFileSystem(createdDirPath: string | null) {
    if (createdDirPath) {
      try {
        await this.fs.rm(createdDirPath, { recursive: true, force: true });
      } catch (rollbackError) {
        console.error('Ошибка отката файловой системы:', rollbackError);
      }
    }
  }
}