// app/api/images/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ImageSyncService } from '@/lib/image-sync-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const imagePath = '/' + path.join('/');
    
    console.log('🖼️ API Images: Запрос изображения:', imagePath);
    
    const syncService = new ImageSyncService();
    const imageUrl = await syncService.getImageUrl(imagePath);
    
    console.log('✅ API Images: Редирект на:', imageUrl);
    
    // Редирект на конечный URL изображения
    return NextResponse.redirect(new URL(imageUrl, request.url));
    
  } catch (error) {
    console.error('❌ API Images: Ошибка:', error);
    return NextResponse.redirect(new URL('/images/placeholder.svg', request.url));
  }
}