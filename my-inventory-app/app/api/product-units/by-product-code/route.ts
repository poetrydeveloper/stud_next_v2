//app/api/product-units/by-product-code/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productCode = searchParams.get('productCode');
    const status = searchParams.get('status');
    const includeLogs = searchParams.get('includeLogs') === 'true'; // ✅ ДОБАВЛЕНО

    console.log("🔍 GET /api/product-units/by-product-code:", { 
      productCode, 
      status, 
      includeLogs 
    });

    if (!productCode) {
      return NextResponse.json(
        { ok: false, error: "productCode обязателен" },
        { status: 400 }
      );
    }

    const whereClause: any = {
      productCode: productCode
    };

    if (status) {
      whereClause.statusProduct = status;
    }

    // ✅ БАЗОВЫЙ SELECT ДЛЯ ОСНОВНЫХ ДАННЫХ
    const baseSelect: any = {
      id: true,
      serialNumber: true,
      statusCard: true,        // ✅ ДОБАВЛЕНО ДЛЯ КАЛЕНДАРЯ
      statusProduct: true,
      disassemblyStatus: true,
      productName: true,
      productCode: true,
      createdAt: true,         // ✅ ДОБАВЛЕНО ДЛЯ КАЛЕНДАРЯ
      updatedAt: true,         // ✅ ДОБАВЛЕНО ДЛЯ КАЛЕНДАРЯ
      product: {
        select: {
          name: true,
          code: true,
          brand: {             // ✅ ДОБАВЛЕНО ДЛЯ ИНФОРМАЦИИ
            select: {
              name: true
            }
          }
        }
      }
    };

    // ✅ ДОБАВЛЯЕМ ЛОГИ ЕСЛИ НУЖНО
    if (includeLogs) {
      baseSelect.logs = {
        select: {
          id: true,
          type: true,
          message: true,
          meta: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 50 // ✅ ОГРАНИЧИВАЕМ КОЛИЧЕСТВО ЛОГОВ
      };
    }

    const units = await prisma.productUnit.findMany({
      where: whereClause,
      select: baseSelect,
      orderBy: { createdAt: 'desc' }
    });

    console.log("✅ GET /api/product-units/by-product-code успешно:", {
      productCode,
      unitsCount: units.length,
      withLogs: includeLogs,
      logsCount: includeLogs ? units.reduce((sum, unit) => sum + (unit.logs?.length || 0), 0) : 0
    });

    return NextResponse.json({ 
      ok: true, 
      data: units 
    });
  } catch (err: any) {
    console.error("❌ GET /api/product-units/by-product-code ошибка:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}