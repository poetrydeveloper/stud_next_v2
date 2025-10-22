// app\api\images\[...path]/route
import { NextRequest, NextResponse } from 'next/server';
import { ImageSyncService } from '@/app/lib/image-sync-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const imagePath = '/' + path.join('/');
    
    const syncService = new ImageSyncService();
    const imageUrl = await syncService.getImageUrl(imagePath);
    
    // Редирект на конечный URL изображения
    return NextResponse.redirect(new URL(imageUrl, request.url));
    
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.redirect(new URL('/images/placeholder.svg', request.url));
  }
}