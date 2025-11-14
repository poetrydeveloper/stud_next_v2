import { NextRequest, NextResponse } from 'next/server';
import { StructureSyncService } from '@/lib/services/StructureSyncService'; // Импорт нового сервиса

export async function POST(request: NextRequest) {
  try {
    const { nodePath } = await request.json();
    const syncService = new StructureSyncService(); // Используем StructureSyncService
    await syncService.safeDeleteNode(nodePath); // Используем safeDeleteNode
    
    return NextResponse.json({ 
      success: true,
      message: `Узел ${nodePath} удален`
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}