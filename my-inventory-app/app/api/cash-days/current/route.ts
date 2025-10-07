// app/api/cash-days/current/route.ts
import { NextResponse } from "next/server";
import { CashDayService } from "@/app/lib/cashDayService";

// GET /api/cash-days/current - получить текущий открытый кассовый день
export async function GET() {
  try {
    const cashDay = await CashDayService.getCurrentCashDay();
    
    return NextResponse.json({ 
      ok: true, 
      data: cashDay 
    });
  } catch (error: any) {
    console.error("GET /api/cash-days/current error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}