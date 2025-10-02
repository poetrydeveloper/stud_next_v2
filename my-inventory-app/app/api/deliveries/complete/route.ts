// app/api/deliveries/complete/route.ts
import { NextResponse } from "next/server";
import { DeliveryService } from '@/app/lib/deliveryService';

export async function POST(req: Request) {
  try {
    const { unitId, receivedDate } = await req.json();
    
    if (!unitId) {
      return NextResponse.json(
        { ok: false, error: "unitId is required" },
        { status: 400 }
      );
    }

    const result = await DeliveryService.completeDelivery(unitId, receivedDate ? new Date(receivedDate) : new Date());
    
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
    console.error("POST /api/deliveries/complete error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}