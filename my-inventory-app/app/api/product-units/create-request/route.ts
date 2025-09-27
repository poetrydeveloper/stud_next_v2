// app/api/product-units/create-request/route.ts
import { NextResponse } from "next/server";
import { RequestService } from "@/app/lib/requestService";

export async function POST(req: Request) {
  console.log("=== API: CREATE PRODUCT UNIT REQUEST ===");
  
  try {
    const body = await req.json();
    const { unitId, quantity } = body;

    console.log("📥 Полученные данные:", { unitId, quantity });

    if (!unitId || !quantity) {
      console.error("❌ Отсутствуют обязательные параметры");
      return NextResponse.json({ 
        ok: false, 
        error: "unitId and quantity required" 
      }, { status: 400 });
    }

    // Используем сервис для создания заявки
    const result = await RequestService.createRequest(unitId, quantity);

    if (result.success) {
      console.log("🎉 Заявка успешно создана:", result.data);
      return NextResponse.json({ 
        ok: true, 
        data: result.data 
      });
    } else {
      console.error("❌ Ошибка создания заявки:", result.error);
      return NextResponse.json({ 
        ok: false, 
        error: result.error 
      }, { status: 400 });
    }

  } catch (err: any) {
    console.error("💥 Критическая ошибка в API:", {
      error: err.message,
      stack: err.stack
    });
    return NextResponse.json({ 
      ok: false, 
      error: err.message 
    }, { status: 500 });
  }
}