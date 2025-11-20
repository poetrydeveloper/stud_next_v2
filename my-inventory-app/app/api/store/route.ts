import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitPhysicalStatus, ProductUnitCardStatus } from "@prisma/client";

export async function GET() {
  try {
    // Активные статусы для отображения (включая разобранные)
    const activePhysicalStatuses: ProductUnitPhysicalStatus[] = [
      'IN_STORE', 
      'IN_DISASSEMBLED',
      'IN_COLLECTED'
    ];

    const activeCardStatuses: ProductUnitCardStatus[] = [
      'CLEAR', 
      'IN_REQUEST', 
      'IN_DELIVERY', 
      'ARRIVED'
    ];

    const spines = await prisma.spine.findMany({
      include: {
        productUnits: {
          where: {
            // Фильтруем по активным статусам (ИЛИ условие)
            OR: [
              {
                statusProduct: {
                  in: activePhysicalStatuses
                }
              },
              {
                statusCard: {
                  in: activeCardStatuses
                }
              }
            ]
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