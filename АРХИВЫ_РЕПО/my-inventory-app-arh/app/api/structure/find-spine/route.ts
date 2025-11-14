// app/api/structure/find-spine/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');

  console.log('🔍 FIND SPINE API: Поиск spine по пути:', path);

  if (!path) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Path parameter required' 
    }, { status: 400 });
  }

  try {
    // НОРМАЛИЗУЕМ ПУТЬ
    const normalizedPath = path
      .replace(/\\/g, '/') // Заменяем обратные слеши на прямые
      .replace(/^structure\//, '') // Убираем префикс structure/ если есть
      .replace(/^\//, ''); // Убираем начальный слеш если есть

    console.log('🔄 Нормализованный путь:', normalizedPath);

    // Ищем spine по разным вариантам пути
    const spine = await prisma.spine.findFirst({
      where: {
        OR: [
          // Точное совпадение с node_index (без structure/)
          { node_index: `structure/${normalizedPath}` },
          // Частичное совпадение
          { node_index: { contains: normalizedPath } },
          { human_path: { contains: normalizedPath } },
        ]
      },
      select: {
        id: true,
        name: true,
        node_index: true,
        human_path: true,
        categoryId: true
      }
    });

    console.log('📊 FIND SPINE API: Результат поиска:', {
      normalizedPath,
      found: !!spine,
      spine: spine ? { id: spine.id, name: spine.name, node_index: spine.node_index } : null
    });

    if (!spine) {
      // Для отладки покажем все spines
      const allSpines = await prisma.spine.findMany({
        select: { id: true, name: true, node_index: true }
      });
      console.log('📋 Все spines для отладки:', allSpines);
    }

    return NextResponse.json({ 
      ok: true, 
      data: spine 
    });
  } catch (error: any) {
    console.error('❌ FIND SPINE API: Ошибка:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}