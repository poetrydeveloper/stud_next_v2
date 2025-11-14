//app/api/structure/category/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { StructureSyncService } from '@/lib/services/StructureSyncService';

export async function POST(request: NextRequest) {
  try {
    const { name, parentPath } = await request.json();
    
    // ДЕТАЛЬНАЯ ВАЛИДАЦИЯ
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Имя категории обязательно и должно быть непустой строкой' 
        },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Имя категории должно быть не менее 2 символов' 
        },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Имя категории должно быть не более 50 символов' 
        },
        { status: 400 }
      );
    }

    const syncService = new StructureSyncService();
    
    // ФИКС: убираем добавление structure/ - теперь это делает StructureService
    const { node_index, dbRecord } = await syncService.syncCategory(name.trim(), parentPath || '');
    
    return NextResponse.json({ 
      success: true, 
      node_index,
      dbRecord,
      path: `/${node_index}`
    });
  } catch (error) {
    console.error('Category API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 400 });
  }
}