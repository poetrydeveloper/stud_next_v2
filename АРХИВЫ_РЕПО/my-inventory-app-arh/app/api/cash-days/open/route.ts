// app/api/cash-days/open/route.ts
import { NextResponse } from "next/server";
import { CashDayService } from '@/app/lib/cashDayService';

export async function POST() {
  try {
    const cashDay = await CashDayService.openCashDay();
    
    return NextResponse.json({ 
      ok: true, 
      data: cashDay,
      message: 'Торговый день открыт'
    });
  } catch (error: any) {
    console.error("POST /api/cash-days/open error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  }
}