// app/api/cash-days/[id]/route.ts
import { NextResponse } from "next/server";
import { CashDayCoreService, CashEventService } from "@/lib/cash";

// GET /api/cash-days/[id] - получить кассовый день по ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cashDayId = Number(params.id);
    const cashDay = await CashDayCoreService.getCashDayById(cashDayId);
    
    return NextResponse.json({ 
      ok: true, 
      data: cashDay 
    });
  } catch (error: any) {
    console.error(`GET /api/cash-days/${params.id} error:`, error);
    
    if (error.message.includes("не найден")) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}