// app/api/structure/product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { StructureSyncService } from '@/lib/services/StructureSyncService';
import { FileStorageAdapter } from '@/lib/file-storage-adapter';
import { PrismaClient } from '@prisma/client';

import { prisma } from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 API Product: Начало обработки запроса');
    
    // ПОЛУЧАЕМ FORMDATA
    const formData = await request.formData();
    
    // Извлекаем текстовые поля
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string || '';
    const parentPath = formData.get('parentPath') as string || '';
    
    // Числовые поля
    const brandId = formData.get('brandId') ? Number(formData.get('brandId')) : undefined;
    const supplierId = formData.get('supplierId') ? Number(formData.get('supplierId')) : undefined;
    const spineId = formData.get('spineId') ? Number(formData.get('spineId')) : undefined;
    const categoryId = formData.get('categoryId') ? Number(formData.get('categoryId')) : undefined;

    // Получаем файлы изображений
    const imageFiles = formData.getAll('images') as File[];
    
    console.log('📥 API Product: Получены данные', {
      code, name, parentPath, brandId, supplierId, imagesCount: imageFiles.length
    });

    // ВАЛИДАЦИЯ ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ
    if (!code || !name) {
      return NextResponse.json({ 
        success: false, 
        error: 'Обязательные поля: code и name' 
      }, { status: 400 });
    }

    const syncService = new StructureSyncService();
    const fileStorage = new FileStorageAdapter();

    // СОЗДАЕМ ПРОДУКТ В ТРАНЗАКЦИИ
    const result = await prisma.$transaction(async (tx) => {
      // 1. Создаем продукт через StructureSyncService
      const { node_index, dbRecord } = await syncService.syncProduct(
        code, name, parentPath, spineId, brandId, categoryId, description, supplierId, []
      );

      console.log('✅ API Product: Продукт создан в БД', dbRecord.id);

      // 2. ОБРАБАТЫВАЕМ ИЗОБРАЖЕНИЯ если есть
      const savedImages = [];
      if (imageFiles.length > 0) {
        console.log(`🖼️ API Product: Обработка ${imageFiles.length} изображений`);
        
        for (let i = 0; i < imageFiles.length; i++) {
          const imageFile = imageFiles[i];
          
          // Валидация изображения
          if (!fileStorage.isImageFormatSupported(imageFile)) {
            console.warn(`⚠️ API Product: Неподдерживаемый формат: ${imageFile.type}`);
            continue;
          }

          if (!fileStorage.validateFileSize(imageFile)) {
            console.warn(`⚠️ API Product: Слишком большой файл: ${imageFile.size} bytes`);
            continue;
          }

          try {
            // Сохраняем изображение
            const imageResult = await fileStorage.uploadProductImage(
              imageFile, 
              dbRecord.id, 
              code
            );

            // Создаем запись в БД ProductImage
            const productImage = await tx.productImage.create({
              data: {
                productId: dbRecord.id,
                filename: imageResult.filename,
                path: imageResult.localPath,
                isMain: i === 0, // первое изображение - главное
                localPath: imageResult.localPath,
                githubUrl: imageResult.githubUrl,
                storageType: imageResult.githubUrl ? 'github' : 'local'
              }
            });

            savedImages.push(productImage);
            console.log(`✅ API Product: Изображение сохранено: ${imageResult.filename}`);

          } catch (error) {
            console.error(`❌ API Product: Ошибка сохранения изображения ${i}:`, error);
          }
        }
      }

      return { node_index, dbRecord, savedImages };
    });

    console.log('🎉 API Product: Продукт полностью создан', {
      productId: result.dbRecord.id,
      imagesCount: result.savedImages.length
    });

    return NextResponse.json({ 
      success: true, 
      node_index: result.node_index,
      dbRecord: result.dbRecord,
      savedImages: result.savedImages,
      path: `/${result.node_index}`
    });
    
  } catch (error) {
    console.error('❌ API Product: Ошибка:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}