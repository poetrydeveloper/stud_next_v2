// app/api/requests/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// POST /api/requests
export async function POST(req: Request) {
  try {
    const { notes } = await req.json();
    
    const request = await prisma.request.create({
      data: {
        notes: notes || null,
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании заявки:", error);
    return NextResponse.json(
      { error: "Не удалось создать заявку" },
      { status: 500 }
    );
  }
}

// GET /api/requests
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const skip = (page - 1) * limit;

    const [requests, totalCount] = await Promise.all([
      prisma.request.findMany({
        include: {
          items: {
            include: { 
              product: {
                include: {
                  images: {
                    where: { isMain: true },
                    take: 1
                  }
                }
              },
              supplier: true,
              customer: true
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.request.count()
    ]);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Ошибка при получении заявок:", error);
    return NextResponse.json(
      { error: "Не удалось получить заявки" },
      { status: 500 }
    );
  }
}