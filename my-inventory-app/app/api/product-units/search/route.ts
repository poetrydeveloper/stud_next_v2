// app/api/product-units/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const productUnits = await prisma.productUnit.findMany({
      where: {
        OR: [
          { serialNumber: { contains: query, mode: 'insensitive' } },
          { product: { name: { contains: query, mode: 'insensitive' } } },
          { product: { code: { contains: query, mode: 'insensitive' } } },
        ]
      },
      include: {
        product: true,
        delivery: true
      },
      take: 10
    });

    return NextResponse.json(productUnits);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Ошибка поиска' },
      { status: 500 }
    );
  }
}