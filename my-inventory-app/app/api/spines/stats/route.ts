// app/api/spines/stats/route.ts
import { NextResponse } from "next/server";
import { SpineAggregationService } from '@/app/lib/spineAggregationService';

export async function GET() {
  try {
    const stats = await SpineAggregationService.getAllSpinesStats();
    
    return NextResponse.json({ 
      ok: true, 
      data: stats 
    });
  } catch (error: any) {
    console.error("GET /api/spines/stats error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}