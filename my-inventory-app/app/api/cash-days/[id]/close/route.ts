// app/api/cash-days/[id]/close/route.ts
import { NextResponse } from "next/server";
import { CashDayService } from '@/app/lib/cashDayService';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cashDayId = Number(params.id);
    const cashDay = await CashDayService.closeCashDay(cashDayId);
    
    return NextResponse.json({ 
      ok: true, 
      data: cashDay,
      message: 'Торговый день закрыт'
    });
  } catch (error: any) {
    console.error("POST /api/cash-days/[id]/close error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  }
}