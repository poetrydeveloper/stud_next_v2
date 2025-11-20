// app/api/cash-days/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
//import { CashDayService } from "@/app/lib/cashDayService";
import { CashDayCoreService, CashEventService } from "@/lib/cash";
// GET /api/cash-days - получить историю кассовых дней
export async function GET() {
  try {
    const cashDays = await CashDayCoreService.getCashDayHistory(7); // Последние 7 дней
    
    return NextResponse.json({ 
      ok: true, 
      data: cashDays 
    });
  } catch (error: any) {
    console.error("GET /api/cash-days error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/cash-days - открыть новый кассовый день
export async function POST() {
  try {
    const cashDay = await CashDayCoreService.openCashDay();
    
    return NextResponse.json({ 
      ok: true, 
      message: "Кассовый день открыт",
      data: cashDay 
    });
  } catch (error: any) {
    console.error("POST /api/cash-days error:", error);
    
    if (error.message.includes("уже открыт")) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}