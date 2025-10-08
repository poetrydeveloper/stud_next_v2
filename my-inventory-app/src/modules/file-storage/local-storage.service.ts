import { Injectable } from '@nestjs/common';
import { ensureDir, writeFile } from 'fs-extra';
import { join } from 'path';

@Injectable()
export class LocalStorageService {
  private readonly mediaPath = join(process.cwd(), 'public', 'media');

  async saveFile(
    file: Express.Multer.File, 
    folder: string, 
    filename: string
  ): Promise<string> {
    const folderPath = join(this.mediaPath, folder);
    const filePath = join(folderPath, filename);
    
    await ensureDir(folderPath);
    await writeFile(filePath, file.buffer);
    
    return `/media/${folder}/${filename}`;
  }

  async fileExists(path: string): Promise<boolean> {
    const fs = await import('fs/promises');
    try {
      await fs.access(join(process.cwd(), 'public', path));
      return true;
    } catch {
      return false;
    }
  }
}