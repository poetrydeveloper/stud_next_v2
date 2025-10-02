// app/api/spines/[id]/stats/route.ts
import { NextResponse } from "next/server";
import { SpineAggregationService } from '@/app/lib/spineAggregationService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const spineId = Number(params.id);
    const stats = await SpineAggregationService.getSpineStats(spineId);
    
    if (!stats) {
      return NextResponse.json(
        { ok: false, error: "Spine not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      ok: true, 
      data: stats 
    });
  } catch (error: any) {
    console.error("GET /api/spines/[id]/stats error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}