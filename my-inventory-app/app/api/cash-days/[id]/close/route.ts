// app/api/cash-days/[id]/close/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { CashDayCoreService, CashEventService } from "@/lib/cash";

// POST /api/cash-days/[id]/close - закрыть кассовый день
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cashDayId = Number(params.id);
    const cashDay = await CashDayCoreService.closeCashDay(cashDayId);
    
    return NextResponse.json({ 
      ok: true, 
      message: "Кассовый день закрыт",
      data: cashDay 
    });
  } catch (error: any) {
    console.error("POST /api/cash-days/[id]/close error:", error);
    
    if (error.message.includes("не найден") || error.message.includes("уже закрыт")) {
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