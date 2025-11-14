// app/api/deliveries/pending/route.ts
import { NextResponse } from "next/server";
import { DeliveryService } from '@/app/lib/deliveryService';

export async function GET() {
  try {
    const pendingDeliveries = await DeliveryService.getPendingDeliveries();
    
    return NextResponse.json({ 
      ok: true, 
      data: pendingDeliveries 
    });
  } catch (error: any) {
    console.error("GET /api/deliveries/pending error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}