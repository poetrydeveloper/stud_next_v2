// app/api/spines/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const spines = await prisma.spine.findMany({
      include: {
        category: true,
        productUnits: {
          include: {
            product: {
              select: {
                brand: { select: { name: true } },
              },
            },
            logs: true,
          },
        },
        _count: {
          select: { productUnits: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ ok: true, spines });
  } catch (err: any) {
    console.error("💥 Ошибка API /spines:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}