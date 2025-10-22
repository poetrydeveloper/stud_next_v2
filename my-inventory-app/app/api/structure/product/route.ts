// app/api/structure/product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { StructureSyncService } from '@/lib/services/StructureSyncService';

export async function POST(request: NextRequest) {
  try {
    const { code, name, parentPath, spineId, brandId, categoryId, description, supplierId } = await request.json();
    
    const syncService = new StructureSyncService();
    const { node_index, dbRecord } = await syncService.syncProduct(
      code, 
      name, 
      parentPath || '', 
      spineId, 
      brandId, 
      categoryId, 
      description,
      supplierId
    );
    
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