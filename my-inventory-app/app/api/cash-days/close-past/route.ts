// app/api/cash-days/close-past/route.ts
import { NextResponse } from "next/server";
import { CashDayAutoCloseService } from "@/app/lib/cash";

// POST /api/cash-days/close-past - закрыть все прошлые незакрытые дни
export async function POST(request: Request) {
  try {
    const results = await CashDayAutoCloseService.closeAllPastCashDays();
    
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    return NextResponse.json({ 
      ok: true, 
      message: `Закрыто дней: ${successCount}, ошибок: ${errorCount}`,
      data: results 
    });
  } catch (error: any) {
    console.error("POST /api/cash-days/close-past error:", error);
    
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/cash-days/close-past - получить статистику по незакрытым дням
export async function GET() {
  try {
    const stats = await CashDayAutoCloseService.getOpenCashDaysStats();
    
    return NextResponse.json({ 
      ok: true, 
      data: stats 
    });
  } catch (error: any) {
    console.error("GET /api/cash-days/close-past error:", error);
    
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}