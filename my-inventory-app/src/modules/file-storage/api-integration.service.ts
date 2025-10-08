import { Injectable } from '@nestjs/common';
import { LegacyAdapterService } from './legacy-adapter.service';
import { PrismaService } from '@prisma/client';

@Injectable()
export class ApiIntegrationService {
  constructor(
    private legacyAdapter: LegacyAdapterService,
    private prisma: PrismaService,
  ) {}

  async handleImageUploadForApi(
    formData: FormData,
    productId: number
  ): Promise<void> {
    const files = formData.getAll('images') as File[];
    
    if (files.length > 0 && files[0].size > 0) {
      await this.legacyAdapter.handleImageUploadLegacy(files, productId);
    }
  }

  async deleteProductImages(imageIds: number[]): Promise<void> {
    for (const imageId of imageIds) {
      const image = await this.prisma.productImage.findUnique({ 
        where: { id: imageId } 
      });
      
      if (image) {
        // Удаляем локальный файл если существует
        if (image.localPath) {
          const fs = await import('fs/promises');
          try {
            await fs.unlink(process.cwd() + '/public' + image.localPath);
          } catch (error) {
            console.warn('Failed to delete local file:', image.localPath);
          }
        }
        
        // Удаляем запись из БД
        await this.prisma.productImage.delete({ where: { id: imageId } });
      }
    }
  }
}