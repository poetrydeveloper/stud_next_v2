// app/api/product-units/request/route.ts
import { NextResponse } from "next/server";
import { RequestService } from "@/app/lib/requestService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { unitId, quantity, pricePerUnit } = body;

    if (!unitId || !quantity) {
      return NextResponse.json({ 
        ok: false, 
        error: "unitId and quantity required" 
      }, { status: 400 });
    }

    if (!pricePerUnit || pricePerUnit <= 0) {
      return NextResponse.json({ 
        ok: false, 
        error: "pricePerUnit required and must be > 0" 
      }, { status: 400 });
    }

    if (quantity < 1) {
      return NextResponse.json({ 
        ok: false, 
        error: "quantity must be >= 1" 
      }, { status: 400 });
    }

    const result = await RequestService.createRequest(unitId, quantity, pricePerUnit);

    if (result.success) {
      return NextResponse.json({ 
        ok: true, 
        data: result.data,
        message: quantity === 1 
          ? "Одиночная заявка создана" 
          : `Множественная заявка на ${quantity} единиц создана`
      });
    } else {
      return NextResponse.json({ 
        ok: false, 
        error: result.error 
      }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ 
      ok: false, 
      error: err.message 
    }, { status: 500 });
  }
}