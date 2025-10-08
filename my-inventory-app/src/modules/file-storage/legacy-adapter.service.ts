import { Injectable } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { PrismaService } from '@prisma/client';

@Injectable()
export class LegacyAdapterService {
  constructor(
    private fileStorage: FileStorageService,
    private prisma: PrismaService,
  ) {}

  async handleImageUploadLegacy(
    files: File[], 
    code: string, 
    productId: number
  ): Promise<void> {
    if (!files.length) return;

    // Проверяем есть ли уже главное изображение
    const mainImageExists = await this.prisma.productImage.findFirst({ 
      where: { productId, isMain: true } 
    });

    const promises: Promise<any>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size === 0) continue;

      // Используем наш FileStorageService
      const result = await this.fileStorage.uploadProductImage(file, productId);
      
      const isMain = !mainImageExists && i === 0;

      // Сохраняем в БД с новыми полями
      promises.push(
        this.prisma.productImage.create({
          data: { 
            productId, 
            filename: file.name,
            path: result.localPath, // сохраняем локальный путь
            localPath: result.localPath,
            githubUrl: result.githubUrl,
            storageType: result.githubUrl ? 'both' : 'local',
            isMain,
          },
        })
      );
    }

    await Promise.all(promises);
  }
}