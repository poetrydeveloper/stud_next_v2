// app/api/deliveries/confirm/route.ts
import { NextResponse } from "next/server";
import { DeliveryService } from '@/app/lib/deliveryService';

export async function POST(req: Request) {
  try {
    const { unitIds, deliveryDate } = await req.json();
    
    if (!unitIds || !Array.isArray(unitIds)) {
      return NextResponse.json(
        { ok: false, error: "unitIds array is required" },
        { status: 400 }
      );
    }

    const result = await DeliveryService.confirmDelivery(unitIds, deliveryDate ? new Date(deliveryDate) : new Date());
    
    if (result.success) {
      return NextResponse.json({ 
        ok: true, 
        data: result.data 
      });
    } else {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("POST /api/deliveries/confirm error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}