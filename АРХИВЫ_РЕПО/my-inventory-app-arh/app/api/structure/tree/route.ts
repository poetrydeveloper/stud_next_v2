//app/api/structure/tree/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { StructureService } from '@/lib/services/StructureService';

export async function GET() {
  try {
    const service = new StructureService();
    const tree = await service.getTree();
    
    return NextResponse.json({ 
      success: true, 
      tree 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}