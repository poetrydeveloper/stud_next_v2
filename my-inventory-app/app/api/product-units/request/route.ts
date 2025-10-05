// app/api/product-units/request/route.ts
import { NextResponse } from "next/server";
import { RequestService } from "@/app/lib/requestService";
import { UnitCloneHelper } from "@/app/lib/unitCloneHelper";

export async function POST(req: Request) {
  console.log("=== API: CREATE REQUEST FROM CANDIDATE ===");
  
  try {
    const body = await req.json();
    const { unitId, quantity, pricePerUnit } = body;

    console.log("📥 Полученные данные:", { unitId, quantity, pricePerUnit });

    // Валидация обязательных полей
    if (!unitId || !quantity) {
      console.error("❌ Отсутствуют обязательные поля: unitId или quantity");
      return NextResponse.json({ 
        ok: false, 
        error: "unitId and quantity required" 
      }, { status: 400 });
    }

    if (!pricePerUnit || pricePerUnit <= 0) {
      console.error("❌ Неверная цена:", pricePerUnit);
      return NextResponse.json({ 
        ok: false, 
        error: "pricePerUnit required and must be > 0" 
      }, { status: 400 });
    }

    if (quantity < 1) {
      console.error("❌ Неверное количество:", quantity);
      return NextResponse.json({ 
        ok: false, 
        error: "quantity must be >= 1" 
      }, { status: 400 });
    }

    console.log("✅ Валидация пройдена");

    // 1. Создаем CLEAR replacement unit
    console.log("🔄 [1] Создаем CLEAR replacement unit...");
    const clearReplacement = await UnitCloneHelper.createClearClone(unitId);
    console.log("✅ [1] CLEAR replacement unit создан:", clearReplacement.serialNumber);

    // 2. Создаем заявку (одиночную или множественную) с ценой
    console.log("🔄 [2] Создаем заявку...");
    const result = await RequestService.createRequest(unitId, quantity, pricePerUnit);

    if (result.success) {
      console.log("✅ [2] Заявка создана успешно");
      
      return NextResponse.json({ 
        ok: true, 
        data: {
          ...result.data,
          clearReplacementUnit: clearReplacement
        },
        message: quantity === 1 
          ? "Одиночная заявка создана" 
          : `Множественная заявка на ${quantity} единиц создана`
      });
    } else {
      console.error("❌ [2] Ошибка создания заявки:", result.error);
      return NextResponse.json({ 
        ok: false, 
        error: result.error 
      }, { status: 400 });
    }
  } catch (err: any) {
    console.error("💥 Критическая ошибка в /request:", err);
    return NextResponse.json({ 
      ok: false, 
      error: err.message 
    }, { status: 500 });
  }
}