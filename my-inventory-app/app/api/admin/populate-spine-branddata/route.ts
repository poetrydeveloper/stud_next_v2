// app/api/admin/populate-spine-branddata/route.ts
import { NextResponse } from "next/server";
import { populateSpineBrandData } from "@/app/lib/scripts/populateSpineBrandData";

export async function POST() {
  try {
    console.log('🚀 Запуск заполнения brandData через API...');
    
    // Можно добавить проверку авторизации если нужно
    // if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    // Запускаем в фоне
    populateSpineBrandData();
    
    return NextResponse.json({ 
      ok: true, 
      message: "Заполнение brandData запущено в фоне" 
    });
  } catch (error: any) {
    console.error('💥 Ошибка запуска скрипта:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}