//app/api/structure/spine/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { StructureSyncService } from '@/lib/services/StructureSyncService';

export async function POST(request: NextRequest) {
  try {
    const { name, parentPath, categoryId } = await request.json();
    const syncService = new StructureSyncService();
    const { node_index, dbRecord } = await syncService.syncSpine(name, parentPath || '', categoryId);
    
    return NextResponse.json({ 
      success: true, 
      node_index,
      dbRecord,
      path: `/${node_index}`
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}