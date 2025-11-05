// app/api/structure/russian-names/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const [categories, spines, products] = await Promise.all([
      prisma.category.findMany({
        select: { 
          slug: true, 
          name: true,
          path: true 
        }
      }),
      prisma.spine.findMany({
        select: { 
          slug: true, 
          name: true 
        }
      }),
      prisma.product.findMany({
        select: { 
          code: true, 
          name: true 
        }
      })
    ]);

    // Создаем единый маппинг
    const nameMapping: { [key: string]: string } = {};

    // Категории: используем slug как ключ (d_bity)
    categories.forEach(cat => {
      nameMapping[cat.slug] = cat.name;
    });

    // Spines: используем slug как ключ (s_torx_t30)  
    spines.forEach(spine => {
      nameMapping[spine.slug] = spine.name;
    });

    // Продукты: используем code как ключ (f75510)
    products.forEach(product => {
      nameMapping[product.code] = product.name;
    });

    return NextResponse.json({ 
      success: true, 
      nameMapping 
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}