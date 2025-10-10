import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitPhysicalStatus } from "@prisma/client";

export async function GET() {
  try {
    // Активные статусы для отображения (включая разобранные)
    const activeStatuses: ProductUnitPhysicalStatus[] = [
      'IN_STORE', 
      'CLEAR', 
      'IN_REQUEST', 
      'IN_DELIVERY', 
      'ARRIVED', 
      'IN_DISASSEMBLED',
      'IN_COLLECTED'
    ];

    const spines = await prisma.spine.findMany({
      include: {
        productUnits: {
          where: {
            // Фильтруем только активные статусы (исключаем проданные/утерянные)
            statusProduct: {
              in: activeStatuses
            }
          },
          include: {
            product: {
              include: {
                brand: true,
                images: {
                  where: { isMain: true },
                  take: 1
                }
              }
            },
            customer: true,
            spine: true,
            supplier: true,
            parentProductUnit: {
              include: {
                product: true
              }
            },
            childProductUnits: {
              where: {
                statusCard: "IN_REQUEST"
              }
            },
            logs: {
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ 
      ok: true, 
      data: spines 
    });
    
  } catch (error: any) {
    console.error("GET /api/store error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}