// app/api/miller-columns/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const parentNodeIndex = searchParams.get('parentNodeIndex') ?? '';
  
  try {
    let nodes: any[] = [];

    if (!parentNodeIndex) {
      // Корневые категории (уровень 1)
      nodes = await getRootCategories();
    } else if (parentNodeIndex.includes('_')) {
      // Определяем уровень по структуре node_index
      const level = getLevelFromNodeIndex(parentNodeIndex);
      
      if (level === 1) {
        // Подкатегории уровня 2
        nodes = await getSubcategories(parentNodeIndex);
      } else if (level === 2) {
        // Спайны уровня 3
        nodes = await getSpines(parentNodeIndex);
      } else if (level === 3) {
        // Продукты уровня 4
        nodes = await getProducts(parentNodeIndex);
      }
    }

    return Response.json(nodes);
  } catch (error) {
    console.error('Miller Columns API Error:', error);
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// Вспомогательные функции
function getLevelFromNodeIndex(nodeIndex: string): number {
  if (!nodeIndex) return 0;
  const parts = nodeIndex.split('_').filter(part => part.includes('V'));
  return parts.length;
}

async function getRootCategories() {
  const categories = await prisma.category.findMany({
    where: { parent_id: null },
    orderBy: { name: 'asc' },
    select: { 
      id: true, 
      name: true, 
      slug: true, 
      node_index: true, 
      human_path: true,
      parent_id: true
    }
  });

  // Проверяем есть ли подкатегории
  const categoriesWithChildren = await Promise.all(
    categories.map(async (cat) => {
      const childCount = await prisma.category.count({
        where: { parent_id: cat.id }
      });
      return {
        ...cat,
        type: 'category' as const,
        hasChildren: childCount > 0
      };
    })
  );

  return categoriesWithChildren;
}

async function getSubcategories(parentNodeIndex: string) {
  // Находим родительскую категорию по node_index
  const parentCategory = await prisma.category.findFirst({
    where: { node_index: parentNodeIndex },
    select: { id: true }
  });

  if (!parentCategory) return [];

  const subcategories = await prisma.category.findMany({
    where: { parent_id: parentCategory.id },
    orderBy: { name: 'asc' },
    select: { 
      id: true, 
      name: true, 
      slug: true, 
      node_index: true, 
      human_path: true,
      parent_id: true
    }
  });

  // Проверяем есть ли подкатегории или спайны
  const subcategoriesWithChildren = await Promise.all(
    subcategories.map(async (cat) => {
      const [childCategories, childSpines] = await Promise.all([
        prisma.category.count({ where: { parent_id: cat.id } }),
        prisma.spine.count({ where: { categoryId: cat.id } })
      ]);
      
      return {
        ...cat,
        type: 'category' as const,
        hasChildren: childCategories > 0 || childSpines > 0
      };
    })
  );

  return subcategoriesWithChildren;
}

async function getSpines(parentNodeIndex: string) {
  // Находим родительскую категорию по node_index
  const parentCategory = await prisma.category.findFirst({
    where: { node_index: parentNodeIndex },
    select: { id: true }
  });

  if (!parentCategory) return [];

  const spines = await prisma.spine.findMany({
    where: { categoryId: parentCategory.id },
    orderBy: { name: 'asc' },
    select: { 
      id: true, 
      name: true, 
      slug: true, 
      node_index: true, 
      human_path: true,
      categoryId: true
    }
  });

  // Проверяем есть ли продукты у спайнов
  const spinesWithProducts = await Promise.all(
    spines.map(async (spine) => {
      const productCount = await prisma.product.count({
        where: { spineId: spine.id }
      });
      
      return {
        ...spine,
        type: 'spine' as const,
        hasProducts: productCount > 0
      };
    })
  );

  return spinesWithProducts;
}

async function getProducts(parentNodeIndex: string) {
  // Находим родительский спайн по node_index
  const parentSpine = await prisma.spine.findFirst({
    where: { node_index: parentNodeIndex },
    select: { id: true }
  });

  if (!parentSpine) return [];

  const products = await prisma.product.findMany({
    where: { spineId: parentSpine.id },
    orderBy: { code: 'asc' },
    select: { 
      id: true, 
      code: true, 
      name: true,
      node_index: true,
      human_path: true,
      brand: { select: { name: true } }
    }
  });

  return products.map(product => ({
    id: product.id,
    name: `${product.code} ${product.name} (${product.brand.name})`,
    code: product.code,
    brand: product.brand.name,
    type: 'product' as const,
    node_index: product.node_index!,
    human_path: product.human_path!
  }));
}