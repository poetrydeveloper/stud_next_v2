// app/api/inventory/snapshots/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    let whereClause: any = {};
    
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      whereClause.snapshotDate = {
        gte: targetDate,
        lt: nextDate
      };
    }

    const snapshots = await prisma.inventorySnapshot.findMany({
      where: whereClause,
      include: {
        productUnit: {
          include: {
            product: {
              select: {
                name: true,
                code: true
              }
            }
          }
        }
      },
      orderBy: {
        snapshotDate: 'desc'
      },
      take: 50 // последние 50 снимков
    });

    // Группируем по датам для удобства
    const groupedByDate: any = {};
    snapshots.forEach(snapshot => {
      const dateStr = snapshot.snapshotDate.toISOString().split('T')[0];
      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = [];
      }
      groupedByDate[dateStr].push(snapshot);
    });

    return NextResponse.json({
      ok: true,
      data: {
        snapshots,
        groupedByDate,
        total: snapshots.length
      }
    });

  } catch (error: any) {
    console.error("GET /api/inventory/snapshots error:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}