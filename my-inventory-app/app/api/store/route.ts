// app/api/store/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const spines = await prisma.spine.findMany({
      include: {
        productUnits: {
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