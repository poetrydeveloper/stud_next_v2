
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productCode = searchParams.get('productCode');
    const status = searchParams.get('status');

    console.log("🔍 GET /api/product-units/by-product-code:", { productCode, status });

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

    const units = await prisma.productUnit.findMany({
      where: whereClause,
      select: {
        id: true,
        serialNumber: true,
        statusProduct: true,
        disassemblyStatus: true,
        productName: true,
        productCode: true,
        product: {
          select: {
            name: true,
            code: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log("✅ GET /api/product-units/by-product-code успешно:", {
      productCode,
      unitsCount: units.length
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